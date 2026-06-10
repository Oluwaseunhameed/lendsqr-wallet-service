# Lendsqr Wallet Service - Assumptions

This document captures assumptions made due to ambiguities or unspecified behavior in the assessment requirements.

## A1. Wallet Auto-Creation

A wallet will be automatically created immediately after successful user registration.

Reason:
The assessment requires wallet functionality but does not specify wallet creation behavior. Automatic wallet creation provides a better onboarding experience.

---

## A2. One User Owns One Wallet

Each user can only have one wallet.

Reason:
The assessment does not mention support for multiple wallets per user.

---

## A3. Transfers To Self Are Not Allowed

Users cannot transfer funds to their own wallets.

Reason:
This operation has no business value and may indicate misuse.

---

## A4. Negative Balances Are Not Allowed

Wallet balances must never become negative.

Reason:
This is a lending wallet MVP and overdraft functionality is not part of the requirements.

---

## A5. Amount Must Be Greater Than Zero

Funding, transfer, and withdrawal amounts must be greater than zero.

Reason:
Zero or negative transactions are invalid.

---

## A6. Email Addresses Must Be Unique

No two users can share the same email address.

Reason:
Email serves as a primary authentication identifier.

---

## A7. Phone Numbers Must Be Unique

No two users can share the same phone number.

Reason:
Prevents duplicate accounts and identity ambiguity.

---

## A8. Authentication Uses JWT

Authentication will be implemented using JSON Web Tokens (JWT).

Reason:
JWT provides a simple and scalable authentication mechanism suitable for MVP systems.

---

## A9. Signout Invalidates Active Sessions

The system will maintain user sessions and invalidate them during signout.

Reason:
The assessment explicitly requires a signout route.

---

## A10. Blacklist Verification Occurs Before User Creation

Adjutor Karma blacklist verification will occur before any user record is persisted.

Reason:
Blacklisted users must never be onboarded.

---

## A11. Protected Operations Require Authentication

Funding, transfer, withdrawal, wallet retrieval, and transaction history endpoints require valid authentication.

Reason:
Only authenticated users should access wallet functionality.

---

## A12. Every Monetary Operation Creates Transaction Records

Every successful funding, transfer, and withdrawal operation will create transaction records.

Reason:
Provides traceability and auditability.

---

## A13. Transfers Must Be Atomic

Sender debit and receiver credit operations must succeed or fail together.

Reason:
Prevents inconsistent balances.

---

## A14. Transaction References Must Be Unique

Every transaction will have a unique reference identifier.

Reason:
Facilitates auditing, troubleshooting, and reconciliation.

---

## A15. Adjutor Service Failures Prevent Onboarding

If the blacklist verification service cannot be reached or returns an invalid response, onboarding will fail.

Reason:
The requirement states that blacklisted users must never be onboarded. Failing closed is safer than failing open.

---

## A16. UUIDs Will Be Used As Primary Keys

All primary keys will use UUIDs instead of auto-incrementing integers.

Reason:
UUIDs are harder to enumerate, more suitable for distributed systems, and commonly used in production-grade financial systems.

---

## A17. Monetary Values Will Use DECIMAL

All monetary values will be stored using DECIMAL(18,2).

Reason:
Floating-point data types can introduce precision errors when handling money.

---

## A18. Transaction History Is Immutable

Transaction records will never be updated or deleted after creation.

Reason:
Financial systems require an auditable history of all money movements.

---

## A19. Users May Have Multiple Active Sessions

A user can be signed in from multiple devices simultaneously.

Reason:
This supports mobile and web access without forcing single-device login.

---

## A20. Session Revocation Will Be Used For Signout

Signing out will revoke the current active session.

Reason:
Provides a server-side signout mechanism.

---

## A21. Knex Will Be Used As The Database Access Layer

The application will use Knex as the query builder and migration tool for MySQL interactions.

Reason:
Knex is explicitly required by the assessment and provides transaction support, migration management, and database abstraction.

---

## A22. Transaction Records Will Store Balance Snapshots

Each transaction will store both the wallet balance before and after the transaction.

Reason:
Improves auditability, troubleshooting, and financial traceability.

---

## A23. Transaction Types Will Be Validated At Application Level

Transaction type values will be stored as strings and validated within the application instead of using database ENUMs.

Reason:
Provides greater flexibility and simpler migrations when using Knex.

---

## A24. The application will use a feature-based modular architecture.

---

## A25. Business logic will reside in services while repositories will handle database access only.

---

## A26. Knex transactions will be initiated at the service layer.

---

## A27. Adjutor integration will be isolated behind a dedicated integration client.

---

## A28. Transaction History Endpoint Will Be Exposed

A transaction history endpoint will be provided even though it is not explicitly requested.

Reason:
Improves auditability and allows easier verification of wallet operations.

---

## A29. API Responses Will Follow A Consistent Envelope

All success and error responses will use a standard response structure.

Reason:
Provides consistency for API consumers and simplifies client-side integration.

---

## A30. API Routes Will Be Versioned

All routes will be exposed under `/api/v1`.

Reason:
Supports future API evolution without breaking existing consumers.

---

## A31. Passwords Will Be Hashed Using bcrypt

Passwords will be hashed before persistence using bcrypt with 12 salt rounds.

Reason:
Provides secure password storage.

---

## A32. JWT Tokens Will Contain User And Session Identifiers

JWT payloads will contain only the minimum information required for authentication.

Reason:
Reduces token size and minimizes exposure.

---

## A33. Validation Will Be Implemented Using Zod

All incoming request payloads will be validated using Zod schemas.

Reason:
Provides runtime validation and TypeScript compatibility.

---

## A34. Authentication Routes Will Be Rate Limited

Signin and signup endpoints will be protected by rate limiting.

Reason:
Reduces brute-force attack risks.

---

## A35. Sensitive Information Will Never Be Logged

Passwords, tokens, secrets, and credentials will not be included in logs.

Reason:
Protects user and system security.

---

## A36. All Wallet Operations Will Execute Within Database Transactions

Funding, withdrawals, and transfers will be executed inside database transactions.

Reason:
Ensures atomicity and prevents partial updates.

---

## A37. Wallet Rows Will Be Locked During Balance Modifications

Wallet records will be locked during withdrawals and transfers.

Reason:
Prevents race conditions and balance inconsistencies.

---

## A38. Transfers Will Generate Two Transaction Records

A transfer will create both a TRANSFER_OUT and TRANSFER_IN transaction.

Reason:
Provides complete financial auditability.

---

## A39. Transfer Records Will Share A Common Transfer Reference

Both sides of a transfer will share the same transfer_reference.

Reason:
Simplifies reconciliation and transaction tracing.

---

## A40. Repository Methods Will Support Transaction Contexts

Repository methods may receive a Knex transaction object.

Reason:
Allows repositories to participate in larger transactional workflows.

---

## A41. Adjutor Responses Will Be Normalized Before Reaching Business Logic

The AuthService will consume a simplified blacklist verification result rather than raw Adjutor responses.

Reason:
Reduces coupling between business logic and third-party APIs.

---

## A42. The System Will Fail Closed When Adjutor Is Unavailable

If blacklist verification cannot be completed, user onboarding will be rejected.

Reason:
The assessment requires that blacklisted users must never be onboarded.

---

## A43. Adjutor Requests Will Use A 5-Second Timeout

Blacklist verification requests will timeout after 5 seconds.

Reason:
Prevents long-running requests from degrading user experience.

---

## A44. Adjutor Integration Will Be Mocked During Unit Tests

Unit tests will not call the real Adjutor API.

Reason:
Ensures deterministic and fast test execution.
