# software-consulting

Generated: 2026-08-31T14:56:40.456Z
Source file: software-consulting.docx

## Seeded issues (answer key)

| Clause type | Severity | Description |
|---|---|---|
| non_compete | medium | Non-compete runs 24 months (exceeds the 12-month standard) and applies broadly across three entire industries regardless of direct competition with Client. |

## Agent (Groq, playbook-grounded)

### Flagged (1)

| Clause type | Severity | Rule | Reason | Excerpt |
|---|---|---|---|---|
| non_compete | medium | non_compete.0 | The clause specifies a duration of 'twenty-four (24) months', which exceeds the standard limit of 12 months, matching risk pattern 0 'Duration exceeding 12 months'. | During the term of this Agreement and for a period of twenty-four (24) months thereafter, Contractor shall not provide software consulting services, in any capacity, to any company operating anywhere in the healthcare, logistics, or financial technology industries, regardless of whether such company competes directly with Client. |

### Not flagged / uncovered (6)

| Clause type | Severity | Reason | Excerpt |
|---|---|---|---|
| other | low | Not a clause type covered by the playbook | Contractor shall provide backend software development services for Client's internal data pipeline, as further described in the applicable Statement of Work. |
| payment_terms | medium | The clause specifies a clear rate, invoicing frequency, and a payment timeline of 'thirty (30) days', which aligns with the standard of net 30 or shorter and does not match any risk patterns. | Client shall pay Contractor at a rate of $95 per hour, invoiced bi-weekly, with payment due within thirty (30) days of invoice. |
| termination | medium | The clause allows either party to terminate with 30 days' notice, which meets the standard. It also provides a 15-day cure period for material breach before immediate termination, satisfying the requirement for a defined cure period. | This Agreement shall continue until the completion of the Statement of Work or until terminated. Either party may terminate this Agreement upon thirty (30) days' written notice, or immediately for uncured material breach following fifteen (15) days' written notice. |
| ip_assignment | high | The clause limits IP ownership to work created specifically for the Client and explicitly carves out general-purpose tools and scripts, consistent with the standard and avoiding the listed risk patterns. | All work product created by Contractor specifically for Client under this Agreement shall be deemed work made for hire and owned by Client upon creation. Contractor retains ownership of any general-purpose tools, scripts, or libraries not created specifically for Client. |
| confidentiality | low | The clause establishes mutual obligations ('Each party'), a reasonable duration ('three (3) years'), and explicit carve outs ('publicly available or independently developed'), which is consistent with the standard and does not match any risk patterns. | Each party shall maintain the confidentiality of the other party's proprietary information for a period of three (3) years following disclosure, excluding information that is publicly available or independently developed. |
| liability | high | Liability is capped at fees paid (within a 6-month window) and applies to each party, meeting the standard for a mutual cap excluding confidentiality breaches. It does not exhibit uncapped liability or one-way risk. | Each party's total liability under this Agreement shall not exceed the fees paid in the six (6) months preceding the claim, excluding liability for breach of confidentiality. |

## Baseline (Ollama, naive prompt)

- The contract does not specify what constitutes a "material breach" for termination purposes, which could lead to disputes over the reasonableness of termination notices.
- The non-competition clause appears overly broad and may be unenforceable in some jurisdictions, particularly if it restricts the Contractor's ability to work in industries unrelated to healthcare, logistics, or financial technology.
- The limitation of liability clause may not provide sufficient protection for the Contractor in the event of a dispute or claim, as it is limited to fees paid in the preceding six months.
- The contract does not specify how the Statement of Work will be created, reviewed, or modified, which could lead to disputes over the scope of services and expectations.
- The contract does not specify what constitutes "proprietary information" for the purposes of confidentiality, which could lead to disputes over what information is protected.
