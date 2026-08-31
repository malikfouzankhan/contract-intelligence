# data-analytics-consulting

Generated: 2026-08-31T14:49:08.890Z
Source file: data-analytics-consulting.docx

## Seeded issues (answer key)

_None listed in the answer key._

## Agent (Groq, playbook-grounded)

### Flagged (1)

| Clause type | Severity | Rule | Reason | Excerpt |
|---|---|---|---|---|
| auto_renewal | low | auto_renewal.1 | The clause states the agreement continues for successive quarterly terms unless terminated, but fails to specify any advance notice or cancellation window. This matches risk pattern 1: 'No reminder or notice obligation before renewal'. | This Agreement shall continue for successive quarterly terms unless terminated. |

### Not flagged / uncovered (8)

| Clause type | Severity | Reason | Excerpt |
|---|---|---|---|
| other | low | Not a clause type covered by the playbook | This Data Analytics Consulting Agreement is entered into as of February 5, 2026 by and between Harborview Logistics Corp. ("Client") and Samuel Ortiz, an independent data analytics consultant ("Consultant"). |
| other | low | Not a clause type covered by the playbook | Consultant shall analyze Client's shipment data and deliver a quarterly performance report identifying operational efficiencies, as described in Exhibit A. |
| payment_terms | medium | The clause specifies a clear 'due within thirty (30) days' timeline and defines a late payment consequence (1% interest per month), which aligns with the standard of net 30 or shorter with defined penalties. | Client shall pay Consultant a fixed fee of $12,000 per quarter, invoiced at the start of each quarter, due within thirty (30) days of invoice. Any amount not paid within thirty (30) days of the due date shall accrue interest at 1% per month. |
| termination | medium | The clause allows either party to terminate, requires 30 days' notice for convenience, and provides a 15-day cure period for material breach, which aligns fully with the standard pattern. | Either party may terminate this Agreement for convenience upon thirty (30) days' prior written notice, or immediately for material breach that remains uncured for fifteen (15) days after written notice. |
| ip_assignment | high | The clause limits assignment to work created specifically for the Client and explicitly carves out ownership of the Provider's underlying tools and methods, matching the standard. | Upon payment, all reports and analyses created specifically for Client under this Agreement shall be assigned to Client. Consultant retains ownership of Consultant's underlying analytical methods, scripts, and tools used to produce the deliverables, and grants Client a perpetual license to use them solely as incorporated into the delivered reports. |
| confidentiality | low | The clause establishes mutual obligations ('Each party shall protect the other party's'), a reasonable duration ('three (3) years'), and includes standard carve-outs ('publicly available', 'already knew'). This is consistent with the standard pattern. | Each party shall protect the other party's confidential information from unauthorized disclosure for a period of three (3) years following disclosure, excluding information that is or becomes publicly available, or that the receiving party already knew prior to disclosure, through no fault of its own. |
| liability | high | The clause caps liability for both parties at fees paid and excludes indirect and consequential damages, which is consistent with the standard definition of capped and mutual liability. | Each party's total liability under this Agreement shall not exceed the total fees paid in the twelve (12) months preceding the claim, and neither party shall be liable for indirect, incidental, or consequential damages. |
| indemnification | high | The clause establishes mutual indemnification ('Each party shall indemnify the other') scoped to 'each party's own breach... or negligent acts', and includes a cap ('shall exceed the limitation of liability set forth above'). This aligns with the standard pattern and does not match any of the listed risk patterns. | Each party shall indemnify the other party against third-party claims arising from that party's own breach of this Agreement or negligent acts, provided that neither party's indemnification obligation shall exceed the limitation of liability set forth above. |

## Baseline (Ollama, naive prompt)

- The contract does not specify what constitutes a 'material breach' in Section 3, which could lead to unclear termination processes.
- The contract limits the Consultant's liability in Section 6, but does not provide similar protection for the Client, creating an uneven risk distribution.
- The contract's definition of confidential information in Section 5 excludes information that becomes publicly available, but does not clarify what constitutes 'publicly available'.
- The contract grants a perpetual license to use the Consultant's analytical methods, scripts, and tools in Section 4, but does not specify any conditions or restrictions on their use.
