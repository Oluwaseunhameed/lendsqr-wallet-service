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
