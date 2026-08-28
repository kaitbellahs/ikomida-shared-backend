# ikomida-shared-backend

The server-side foundation: data access, messaging and third-party gateways.

> Part of the **iKomida** platform. See **[ikomida-k8s-config](https://github.com/kaitbellahs/ikomida-k8s-config)** for the architecture overview of all 31 repositories.

---

## Role

Consumed by every service, worker and job. Holds the persistence layer, the messaging client, and the integrations with outside providers — so that "how we talk to Asaas" or "how we connect to RabbitMQ" is written once and fixed once.

## Contents

| Module | Contents |
|---|---|
| `Domain/Models/` | 37 Sequelize models — the full relational schema in TypeScript |
| `Domain/RabbitMQ.ts` | Broker client, queue definitions, publish and consume with acknowledgement |
| `Domain/SqlDB.ts` | Connection and query layer over MySQL |
| `Domain/MicroService.ts` | Service discovery — the addresses the gateway proxies to |
| `GateWays/` | Provider integrations: **Asaas**, **PagSeguro** (payments), **Mailjet** (email), **OtimaTel** (SMS) |
| `Utils/` | Logging, error types, helpers |
| `Decorators/`, `Helpers/` | Cross-cutting concerns |

## Queues

`EMAIL_QUEUE` · `SMS_QUEUE` · `PAYMENT_QUEUE` · `PUSH_NOTIFICATION_QUEUE` · `VENDOR_PUSH_NOTIFICATION_QUEUE` · `APPS_QUEUE` · `REFERRAL_QUEUE`

## Stack

TypeScript · rollup · API Extractor · published as a versioned npm package

## Build

```bash
yarn install
yarn build
yarn build:types   # API Extractor rollup of .d.ts
```

## Status

Built in 2022. The platform is no longer deployed; this repository is published as a record of the work. **The commit history predates generative AI coding assistants.**

## License

Licensed under the [Apache License 2.0](LICENSE) — free for commercial use, provided the copyright notice and [NOTICE](NOTICE) are retained.

Copyright 2022 Khalid Ait Bellahs.
