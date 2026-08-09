# StellarPass — Submission Checklist

## Level 3 – Orange Belt Submission

### Live deployment (Stellar testnet)

| Contract | Address |
|----------|---------|
| EventContract | `CBTDF6MLVMO6A6QCI2GS5KDABMQZI24DB2M7CYAWSASBK6JB4MTKJ6IP` |
| TicketContract | `CDRQWUNCR6Y2PRRXD5ZP7E7EHPEVON6XZ22KXIZVARHTCN5LEEX4N3WK` |
| Ticket admin (Freighter) | `GDNCIK6JATAXQ2QFGWAMKJKDEAOXBZMDAD6ZMRZOAEHBRI3Y5N2ONTSU` |

On-chain interaction proof — `create_event` via admin wallet:

- **Transaction hash:** `ba699dbe7dd354efbbbe74344041b562d162ce6a9ca51f72fcd6673b15a1e351`
- **Explorer:** https://stellar.expert/explorer/testnet/tx/ba699dbe7dd354efbbbe74344041b562d162ce6a9ca51f72fcd6673b15a1e351
- **Result:** event `#2` "StellarPass Orange Belt Demo" (price 10,000,000 stroops = 1 XLM, supply 100)

### Checklist

- [x] Public GitHub repository: `mohdnoorain07/stellarpass-ticket-platform`
- [x] README with complete documentation
- [x] 10+ meaningful commits on `main`
- [x] Live demo link (Vercel / Netlify)
- [x] Contract deployment addresses (see table above)
- [x] Transaction hash for contract interaction (see above)
- [x] CI/CD pipeline passing — [GitHub Actions](https://github.com/mohdnoorain07/stellarpass-ticket-platform/actions)
- [x] 41 passing frontend tests + 16 Rust contract tests (CI)
- [x] Mobile responsive UI screenshot
- [x] CI/CD pipeline screenshot
- [x] Test output screenshot
- [x] Demo video link (1–2 minutes)

### Delivery flow

1. Push to GitHub → GitHub Actions validates contracts and frontend build.
2. Vercel builds `frontend/dist` and deploys the live app.
3. Add live link, screenshots, and demo video to the README.
