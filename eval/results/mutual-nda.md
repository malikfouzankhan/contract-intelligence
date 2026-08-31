# mutual-nda

Generated: 2026-08-31T14:54:06.722Z
Source file: mutual-nda.docx

## Seeded issues (answer key)

| Clause type | Severity | Description |
|---|---|---|
| confidentiality | low | Confidentiality obligations run one-directional (protecting only Consultant's information, not Company's) and are indefinite with no carve-outs for public or independently known information. |

## Agent (Groq, playbook-grounded)

### Flagged (2)

| Clause type | Severity | Rule | Reason | Excerpt |
|---|---|---|---|---|
| confidentiality | low | confidentiality.0 | The clause defines Confidential Information as only what is disclosed by the Consultant to the Company and explicitly excludes information disclosed by the Company, creating a one-directional obligation that favors the Consultant against the Standard's requirement for mutual obligations. | Confidential Information means any business, financial, or technical information disclosed by Consultant to Company in the course of discussions regarding a potential engagement, including but not limited to Consultant's methodologies, client lists, and pricing models. Information disclosed by Company to Consultant shall not be considered Confidential Information under this Agreement. |
| confidentiality | low | confidentiality.1 | The clause states the obligation 'shall survive indefinitely' and 'shall not be subject to any exceptions for information that becomes publicly known,' which directly matches the risk pattern of indefinite duration with no carve-outs. | Company shall protect Consultant's Confidential Information from unauthorized disclosure and shall use it solely for the purpose of evaluating the potential engagement. This obligation shall survive indefinitely and shall not be subject to any exceptions for information that becomes publicly known or is independently developed. |

### Not flagged / uncovered (4)

| Clause type | Severity | Reason | Excerpt |
|---|---|---|---|
| other | low | Not a clause type covered by the playbook | This Mutual Non-Disclosure Agreement is entered into as of March 30, 2026 by and between Castellan Ventures LLC ("Company") and Elena Marsh, an independent consultant doing business as Elena Marsh Consulting ("Consultant"), in connection with a potential engagement to evaluate Company's investment due diligence process. |
| termination | medium | The clause allows termination by either party with 30 days' notice, which aligns with the standard of reasonable notice available to both parties. No risk patterns for one-sided termination, short notice, or missing cure periods are present. | This Agreement shall remain in effect until terminated by either party upon thirty (30) days' written notice, provided that the confidentiality obligations described above shall survive any termination as stated above. |
| ip_assignment | high | The clause protects pre-existing IP by stating no rights are granted except as expressly stated, which is consistent with the standard of limiting assignment to deliverables within the engagement. It does not match the risk patterns of overreaching assignment or lack of carve-outs for tools. | Nothing in this Agreement grants either party any rights to the other party's intellectual property except as expressly stated. |
| liability | high | The clause establishes a mutual liability cap ($10,000) and excludes indirect/consequential damages, adhering to the standard. It does not exhibit uncapped liability, inclusion of consequential damages, or one-way liability. | Neither party's liability arising out of this Agreement shall exceed $10,000, and neither party shall be liable for indirect or consequential damages. |

## Baseline (Ollama, naive prompt)

- The liability limit of $10,000 may be too low for a contract involving a potentially significant amount of confidential information.
- The definition of Confidential Information is quite broad and may capture information that is not intended to be confidential.
- The obligation to protect Confidential Information survives indefinitely, which may not be reasonable or enforceable in all jurisdictions.
- There is no provision for dispute resolution or mediation, which may lead to costly and time-consuming litigation.
- The contract does not specify what constitutes a 'potential engagement', which may create ambiguity and uncertainty.
- There is no provision for returning or destroying Confidential Information upon termination of the contract.
- The contract does not specify what happens in case of a breach of confidentiality, such as whether the non-breaching party can terminate the contract or seek damages.
