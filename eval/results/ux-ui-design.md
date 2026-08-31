# ux-ui-design

Generated: 2026-08-31T14:57:47.898Z
Source file: ux-ui-design.docx

## Seeded issues (answer key)

| Clause type | Severity | Description |
|---|---|---|
| indemnification | high | Indemnification is one-directional, extends to Client's own misuse of deliverables (outside Consultant's control), and carries no cap. |
| auto_renewal | low | Auto-renewal cancellation window is only ten days with no reminder obligation on Client. |

## Agent (Groq, playbook-grounded)

### Flagged (2)

| Clause type | Severity | Rule | Reason | Excerpt |
|---|---|---|---|---|
| indemnification | high | indemnification.0 | The clause explicitly states 'Client shall have no corresponding indemnification obligation to Consultant,' creating a one-directional indemnification favoring only the client, which matches risk pattern 0. Additionally, it lacks a cap (risk pattern 2) and extends to client misuse (risk pattern 1), but 0 is the primary structural deviation noted. | Consultant shall indemnify, defend, and hold harmless Client from and against any and all claims, damages, losses, and expenses, including those arising from Client's own modification or misuse of the delivered designs after handoff, with no limit on the amount Consultant may be required to pay. Client shall have no corresponding indemnification obligation to Consultant. |
| auto_renewal | low | auto_renewal.0 | The clause requires only 10 days' notice to prevent auto-renewal, which is an unreasonably short cancellation window compared to the standard 30-60 days, matching risk pattern [0]. | This Agreement shall automatically renew for successive one (1) year terms unless either party provides written notice of non-renewal at least ten (10) days before the end of the then-current term. Client shall have no obligation to notify Consultant in advance of the approaching renewal deadline. |

### Not flagged / uncovered (6)

| Clause type | Severity | Reason | Excerpt |
|---|---|---|---|
| other | low | Not a clause type covered by the playbook | This UX/UI Design Consulting Agreement is entered into as of April 2, 2026 by and between Fernbridge SaaS Inc. ("Client") and Nadia Kessler, an independent design consultant doing business as Nadia Kessler Design ("Consultant"). |
| other | low | Not a clause type covered by the playbook | Consultant shall provide user experience research, wireframing, and interface design services for Client's product redesign, as described in the applicable Statement of Work. |
| payment_terms | medium | The clause specifies a clear payment amount ($7,500), trigger (completion of phase), and timeline (within thirty days), which aligns with the standard for defined payment schedules and does not match any of the listed risk patterns. | Client shall pay Consultant $7,500 per project phase, invoiced upon completion of each phase, due within thirty (30) days of invoice. |
| termination | medium | The clause allows either party to terminate, provides a standard 30-day notice, and includes a defined 15-day cure period for material breach, matching all aspects of the standard pattern. | This Agreement shall continue for the duration of the Statement of Work. Either party may terminate upon thirty (30) days' written notice, or immediately for uncured material breach following fifteen (15) days' written notice. |
| ip_assignment | high | The assignment is explicitly limited to deliverables created for the Client, and the clause includes a clear carve-out for pre-existing IP, tools, and templates, adhering to the standard and avoiding all listed risk patterns. | Upon payment, all design deliverables created specifically for Client under this Agreement shall be assigned to Client. Consultant retains ownership of any pre-existing design systems, component libraries, or templates used to produce the deliverables. |
| confidentiality | low | The clause imposes mutual confidentiality obligations ('Each party shall maintain...') for a reasonable duration (three years), which is consistent with the standard pattern and does not match the risks of one-directional obligations, indefinite duration, or unreasonably broad definitions. | Each party shall maintain the confidentiality of the other party's proprietary information for a period of three (3) years following disclosure. |

## Baseline (Ollama, naive prompt)

- The indemnification clause (5) appears to be overly broad and unfair to the Consultant, as they may be held liable for Client's own modifications or misuse of the delivered designs.
- The auto-renewal clause (6) may not be in the best interest of the Consultant, as it allows the contract to renew without explicit consent or notification.
- The confidentiality clause (7) has a duration of 3 years, which may be longer than necessary for the purposes of this contract.
