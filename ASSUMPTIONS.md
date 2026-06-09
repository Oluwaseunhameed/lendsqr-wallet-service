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
Provides a server-side signout mechanism as required by the assessment.

---

## A21. Knex Will Be Used As The Database Access Layer

The application will use Knex as the query builder and migration tool for MySQL interactions.

Reason:
Knex is explicitly required by the assessment and provides transaction support, migration management, and database abstraction.
