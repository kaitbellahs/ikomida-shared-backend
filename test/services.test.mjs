import {
    expect,
    describe
} from 'chai';

describe('class equals tests', () => {
    const product = CProduct.init('ka', 100, 1, Types.Types.TDiscount.NO, 1, undefined, undefined, undefined, undefined, undefined, undefined, [Types.Classes.CProductOptionsCategory.fillWith(null), Types.Classes.CProductOptionsCategory.fillWith(null)], [])
    const product2 = Types.Classes.CProduct.init('ka', 100, 1, Types.Types.TDiscount.NO, 1, undefined, undefined, undefined, undefined, undefined, undefined, [Types.Classes.CProductOptionsCategory.fillWith(null)], [])
    console.log('equals:', product.equal(product2))
    it('db should be instance of DB', () => {
        expect(db).to.be.an.instanceof(DB)
    })
    it('db should connect to database', async () => {
        await db.connectToServer()
        expect(db.getDb()).to.be.an.instanceof(Db)
    })
    it('Collection shoud contain aggregateOne', async () => {
        expect(db.ordersCollection).to.have.property('aggregateOne')
    })
    it('Collection.aggregateOne shoud be a function', async () => {
        expect(db.ordersCollection.aggregateOne).to.be.an.instanceof(Function)
    })
})

describe('index.mjs tests', () => {
    const db = DB.getInstance()
    it('compar password', async () => {
        expect(await comparePassword("123456ABCDabcd@!", (await cryptPassword("123456ABCDabcd@!")).hash)).to.be.true;
    })
    it('', async () => {
        expect(slugging("ab6-n%0 o@ çó sÃo")).to.be.equal('ab6-n0-o-co-so')
    })
    it('Test generateAccessToken and authenticateToken', async () => {
        const object = {
            test: 'test'
        };
        const generatedToken = await generateAccessToken(object)
        let req = {
            headers: {
                authorization: `bearer ${generatedToken}`
            }
        }
        const res = {
            sendStatus: val => { }
        }
        const next = () => { };
        await authenticateToken(req, res, next)
        const result = JSON.parse(req.headers?.identity)
        expect(result.test).to.be.equal('test')
    })
    it('Pad test', async () => {
        expect(pad(10, 5)).to.be.equal("00010")
    })
    it('generateReturn test', async () => {
        expect(generateReturn(false, {
            test: 'test'
        })).to.be.equal('{"success":false,"data":{"test":"test"}}')
    })
    it('toNumber test', async () => {
        const result = toNumber("m010kÁ340#@i-0=+`'}]98n")
        expect(typeof result).to.be.equal('number')
        expect(result).to.be.equal(10340098)
    })
    it('deepCopy test', async () => {
        const object = {
            test: 'test'
        };
        const beepObject = deepCopy(object)
        expect(beepObject.test).to.be.equal(object.test)
    })
    it('test signData e validateSignature', async () => {
        const object = {
            test: 'test'
        };
        const generatedSignature = await signData(object)
        expect(await validateSignature(object, generatedSignature)).to.be.true;
    })
})