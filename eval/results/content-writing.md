# content-writing

Generated: 2026-08-31T14:47:56.252Z
Source file: content-writing.docx

## Seeded issues (answer key)

| Clause type | Severity | Description |
|---|---|---|
| auto_renewal | low | Auto-renewal cancellation window is only five days with no reminder obligation on Client, well short of the standard 30-60 day notice window. |

## Agent (Groq, playbook-grounded)

### Flagged (2)

| Clause type | Severity | Rule | Reason | Excerpt |
|---|---|---|---|---|
| auto_renewal | low | auto_renewal.0 | The clause requires notice of non-renewal no later than five (5) days before the renewal. This constitutes a 'Very short cancellation window' compared to the standard of 30 to 60 days, creating a high risk of inadvertent renewal. | 3. Term and Renewal  This Agreement shall automatically renew each month unless either party provides notice of non-renewal. Contractor must provide such notice in writing no later than five (5) days before the start of the next monthly term, and Client shall have no obligation to remind Contractor of this window. |
| confidentiality | low | confidentiality.1 | While the duration (2 years) is reasonable and the obligation is mutual, the clause lacks the standard carve-outs for information that is publicly available or independently developed, matching the pattern of missing carve-outs. | 5. Confidentiality  Each party agrees not to disclose the other party's confidential business information to third parties for a period of two (2) years following disclosure. |

### Not flagged / uncovered (4)

| Clause type | Severity | Reason | Excerpt |
|---|---|---|---|
| other | low | Not a clause type covered by the playbook | This Content Writing Services Agreement is entered into as of May 5, 2026 by and between Northgate Financial Advisors, a registered investment advisory firm ("Client"), and Priya Ramanathan, an independent freelance writer ("Contractor"). |
| other | low | Not a clause type covered by the playbook | 1. Scope of Services  Contractor shall write and deliver four (4) blog articles per month for Client, on topics assigned by Client, in accordance with Client's editorial guidelines. |
| payment_terms | medium | The clause specifies a clear payment schedule ($400 per article, invoiced monthly) and a defined timeline (due within 15 days), which aligns with the standard of net 30 or shorter. It does not exhibit vague timelines, excessively long terms without penalties, or discretionary withholding rights. | 2. Payment Terms  Client shall pay Contractor $400 per article, invoiced monthly, due within fifteen (15) days of invoice. |
| ip_assignment | high | The assignment is explicitly limited to 'all articles written under this Agreement,' which conforms to the standard of limiting IP assignment to deliverables created under the specific engagement. It does not claim pre-existing IP, work for other clients, or the contractor's tools and frameworks. | 4. Intellectual Property  Upon payment, all articles written under this Agreement shall be assigned to Client, who may publish, edit, and distribute them without further compensation to Contractor. |

## Baseline (Ollama, naive prompt)

- The contract does not specify the method of payment, making it unclear how the contractor will receive payment.
- The contract does not specify the format or quality standards for the articles, which may lead to disagreements between the parties.
- The contract's automatic renewal clause may be problematic if the contractor does not intend to continue working for the client, and may require the contractor to take proactive steps to cancel the agreement.
- The contract does not address what happens in case of non-payment by the client, which may leave the contractor without compensation for their work.
- The contract's confidentiality clause is broad and may be overly restrictive, potentially limiting the contractor's ability to use their skills and experience for other projects.
- The contract does not specify how disputes will be resolved, which may lead to conflicts and difficulties in resolving issues that arise during the agreement.
- The contract does not address termination, which may leave ambiguity about the parties' obligations and responsibilities when the agreement is ended.
