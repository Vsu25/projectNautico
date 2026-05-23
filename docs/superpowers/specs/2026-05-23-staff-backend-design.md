# Staff Backend (Frontend Mockup) Design Specification

This document details the architectural design and functional specifications for the Staff Panel mockup within the Club Nautico FinTech ecosystem.

## Goal Description
The Staff Panel provides administrative tools for club managers to verify member deposits, manage member balances, post fees, and track overall billing. It is completely isolated from the partner-facing views, utilizing a desktop-first, highly readable Top Navbar layout that remains responsive. It inherits the active global theme (Glass, Flat, Brutalist) and mode (Light, Dark).

---

## User Review Required

> [!NOTE]
> The Staff Panel shares the global theme switching engine. Setting a global theme (e.g. Brutalist Light or Glass Dark) will apply to the Staff Panel, adapting all table rows, borders, buttons, and layout containers accordingly.

> [!IMPORTANT]
> The mockup uses a simulated authentication routing system. Access is granted from a single login page based on user credentials (role-based routing).

---

## Proposed System Architecture

### 1. Unified Authentication Flow
A central login screen will guard the application:
* **Route Toggle:** Managed via a global React state (`currentUser`) and stored in `localStorage`.
* **Login Credentials (Simulation):**
  * `socio@club.com` -> Logs in as a Member (redirects to the themed Partner Portal views).
  * `staff@club.com` or `admin@club.com` -> Logs in as Staff (redirects to the Staff Panel).
* **Logout:** A logout button in the header clears the state, returning the user to the unified login screen.

### 2. Layout Structure: Top Navbar
* **Header / Navigation:** 
  * Left: Brand logo ("Club Náutico - Staff Panel") and a badge showing the current staff role.
  * Center: Navigation links (Verify Deposits, Member Directory, Billing Admin).
  * Right: Theme switcher, Light/Dark toggle, and the Logout button.
* **Main Canvas:**
  * Full-width container optimized for dense grids and tables.
  * Responsive margins that adjust to laptop, tablet, and mobile screens.

### 3. Core Administrative Views

#### View A: Verify Deposits Queue (Payments)
A ledger of deposit reports pending approval.
* **Fields:** Member Name, Date Reported, Amount, Reference ID, Receipt Attachment, Status (Pending, Approved, Rejected).
* **Actions:**
  * **Approve:** Opens confirmation, updates status to Approved, and updates the member's balance in simulated state.
  * **Reject:** Opens a modal to input a rejection reason (e.g., "Mismatched receipt image", "Deposit not received in bank"). Updates status to Rejected.

#### View B: Member Directory
A database index of all active and inactive club partners.
* **Fields:** Partner ID, Full Name, Email, Phone, Status (Active/Suspended), Balance ($), Pending Debts ($).
* **Search / Filter:** Search bar filtering by Name or ID, and status filtering (All, Active, Suspended, In Debt).
* **Detail Draw:** Clicking on a member row expands a side drawer or modal showing their individual transaction ledger.

#### View C: Billing & Fee Management
Controls for managing club invoicing.
* **Manual Charge Form:** Select a member, input amount, concept (e.g., "Extra Boat Slip rental"), and date.
* **Mass Invoicing:** A single button to "Generate Monthly Fees" which automatically applies a standard membership charge (e.g., $100) to all active members.
* **Summary Reports:** Metric cards showing total receivables (member debt) and total collections (approved payments) for the month.

---

## Verification Plan

### Manual Verification
1. Open the application.
2. Verify that the unified login page appears.
3. Log in with `socio@club.com` and ensure the Member layout opens. Log out.
4. Log in with `staff@club.com` and ensure the Staff layout (with Top Navbar) opens.
5. In Staff layout, switch themes (Glass, Flat, Brutalist) and modes (Light, Dark). Confirm the layout responds correctly and matches styling rules.
6. Verify payments by approving or rejecting, check that partner directory balances update, and test posting manual charges and generating monthly fees.
7. Test responsiveness by resizing the window to mobile width.
