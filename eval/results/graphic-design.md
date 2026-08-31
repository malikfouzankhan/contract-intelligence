# graphic-design

Generated: 2026-08-31T14:51:46.231Z
Source file: graphic-design.docx

## Seeded issues (answer key)

| Clause type | Severity | Description |
|---|---|---|
| termination | medium | Termination is one-directional: Client may terminate for any reason at any time, while Contractor may only terminate for an uncured payment failure. |

## Agent (Groq, playbook-grounded)

### Flagged (1)

| Clause type | Severity | Rule | Reason | Excerpt |
|---|---|---|---|---|
| termination | medium | termination.0 | The clause allows termination by the Client 'at any time, for any reason', but restricts Contractor to terminate only for non-payment. This matches risk pattern [0] ('Termination available to only one party') as the termination rights are asymmetrical and skewed towards the Client. | This Agreement may be terminated by Client at any time, for any reason, upon written notice to Contractor. Contractor may only terminate this Agreement in the event Client fails to make a required payment and such failure remains uncured for thirty (30) days after written notice. |

### Not flagged / uncovered (6)

| Clause type | Severity | Reason | Excerpt |
|---|---|---|---|
| other | low | Not a clause type covered by the playbook | This Graphic Design Services Agreement is entered into as of April 10, 2026 by and between Brightleaf Coffee Co., a California corporation ("Client"), and Marcus Ibe, an independent contractor doing business as Marcus Ibe Design ("Contractor"). |
| other | low | Not a clause type covered by the playbook | Contractor shall design a brand identity package for Client, including logo design, packaging artwork, and a brand style guide, as further described in Exhibit A. |
| payment_terms | medium | The clause defines a clear payment schedule (50% on signing, 50% in 15 days) and specifies late payment consequences ($50/week), which aligns with the standard pattern and avoids the listed risk patterns. | Client shall pay Contractor a fixed fee of $6,200, with 50% due upon signing and the remaining 50% due within fifteen (15) days of final delivery. Late payments shall accrue a fee of $50 for each week payment remains outstanding. |
| ip_assignment | high | The clause limits assignment to 'final approved designs created under this Agreement', which aligns with the standard of limiting IP assignment to deliverables of the specific engagement. It also explicitly retains rights for the portfolio, avoiding risk pattern [2]. | Upon receipt of full payment, Contractor assigns to Client all rights in the final approved designs created under this Agreement. Contractor retains the right to display the work in Contractor's professional portfolio. |
| confidentiality | low | The clause establishes mutual confidentiality ('Each party shall keep confidential') for a reasonable duration ('two (2) years'), which matches the standard pattern. While carve-outs are not explicitly listed, the presence of mutual obligation and finite duration means it does not match the specific risk patterns of one-directional, indefinite, or broad definitions provided. | Each party shall keep confidential any non-public business information disclosed by the other party in connection with this engagement, for a period of two (2) years from the date of disclosure. |
| liability | high | The clause caps liability at 'total fees paid' and excludes 'indirect, incidental, or consequential damages' for 'either party'. This matches the standard of capped liability and mutual exclusion of consequential damages. | Contractor's total liability arising out of this Agreement shall not exceed the total fees paid by Client under this Agreement, and in no event shall either party be liable for indirect, incidental, or consequential damages. |

## Baseline (Ollama, naive prompt)

- The payment terms are unclear regarding what constitutes "final delivery" and how late payments will be handled.
- The termination clause appears one-sided, favoring the Client with no similar provisions for the Contractor.
- The limitation of liability clause may not provide sufficient protection for the Contractor in the event of unforeseen circumstances.
- The contract lacks specific details on what constitutes "non-public business information" under the confidentiality clause.
- The contract does not specify any penalties or consequences for the Client in the event they fail to make timely payments.
- The contract does not outline any process for resolving disputes or disagreements between the parties.
