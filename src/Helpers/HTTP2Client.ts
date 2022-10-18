import { Interfaces } from '@ikomida/shared-types';
import http2, { ClientHttp2Session, OutgoingHttpHeaders } from 'http2'
export interface IHTTP2Response {
    status: number;
    headers: Interfaces.IMetadata;
    data: any
}
export default class HTTP2Client {

    host: string
    port: number
    http2Client?: ClientHttp2Session
    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    open() {
        this.http2Client = http2.connect(`${this.host}:${this.port}`)
        this.http2Client.on('error', (err) => console.error(err));
    }

    isAlive() {
        return this.http2Client?.connecting
    }

    close() {
        this.http2Client?.close()
        this.http2Client = undefined
    }

    post(url: string, inHeaders: OutgoingHttpHeaders, body: any): Promise<IHTTP2Response> {
        const headers = {
            ...inHeaders,
            ":method": "POST",
            ":path": url,
        };
        return new Promise((resolve, reject) => {
            if (!this.isAlive()) {
                this.open()
            }
            const req = this.http2Client?.request(headers)
            if (req) {
                const localHeaders: Interfaces.IMetadata = {}
                req.on('response', (heads, flags) => {
                    console.log('flags:', flags)
                    for (const name in heads) {
                        localHeaders[name] = `${heads[name]}`
                        console.log(`${name}: ${heads[name]}`)
                    }
                });
                req.setEncoding('utf8');
                let data = '';
                req.on('data', (chunk) => { data += chunk; });
                req.on('end', () => {
                    const result: IHTTP2Response = {
                        status: 0,
                        headers: localHeaders,
                        data
                    };
                    if (':status' in localHeaders) {
                        result.status = Number(localHeaders[':status']);
                    }
                    resolve(result);
                })
                req.on('error', (error: any) => {
                    reject(error);
                });
                req.write(JSON.stringify(body))
                req.end();
            } else {
                reject(new Error('http2Client not initaited'));
            }
        });

    }
}

