# freelance-web-dev

Generated: 2026-08-31T14:50:38.891Z
Source file: freelance-web-dev.docx

## Seeded issues (answer key)

| Clause type | Severity | Description |
|---|---|---|
| liability | high | Liability is explicitly unlimited and includes indirect, incidental, and consequential damages, with no cap tied to fees paid. |

## Agent (Groq, playbook-grounded)

### Flagged (1)

| Clause type | Severity | Rule | Reason | Excerpt |
|---|---|---|---|---|
| liability | high | liability.0 | The clause explicitly states that liability shall be 'unlimited' and includes consequential damages, matching risk pattern 0 (Uncapped or unlimited liability) and pattern 1 (Explicit inclusion of indirect or consequential damages). Pattern 0 is selected as the primary deviation from the capped liability standard. | Contractor's total liability under this Agreement, whether in contract, tort, or otherwise, shall be unlimited and shall include any direct, indirect, incidental, special, or consequential damages arising out of or related to this Agreement, regardless of the theory of liability. |

### Not flagged / uncovered (6)

| Clause type | Severity | Reason | Excerpt |
|---|---|---|---|
| other | low | Not a clause type covered by the playbook | This Web Development Services Agreement ("Agreement") is entered into as of March 3, 2026 by and between Meridian Retail Group LLC, a Delaware limited liability company ("Client"), and Ada Sorensen, an independent contractor doing business as Sorensen Web Studio ("Contractor"). |
| other | low | Not a clause type covered by the playbook | Contractor shall design, develop, and deliver a responsive e-commerce website for Client, including the features and specifications set forth in Exhibit A, and shall provide reasonable post-launch support for a period of thirty (30) days following final delivery. |
| payment_terms | medium | The clause defines a clear payment schedule with specific installments and timelines (including 30 days), and specifies a late payment penalty (1.5% interest per month). This aligns with the standard for clear schedules and consequences, and does not match any of the listed risk patterns. | Client shall pay Contractor a total fee of $18,500, payable in three installments: 30% upon execution of this Agreement, 40% upon delivery of a staging build, and the remaining 30% within thirty (30) days of final delivery and Client acceptance. Any invoice not paid within the stated period shall accrue interest at 1.5% per month on the outstanding balance. |
| termination | medium | The clause allows either party to terminate with a standard 30-day notice and includes a 15-day cure period for material breach, consistent with the standard pattern. | This Agreement shall remain in effect until completion of the Services unless terminated earlier. Either party may terminate this Agreement for convenience upon thirty (30) days' prior written notice, or immediately for material breach if such breach remains uncured for fifteen (15) days after written notice of the breach. |
| ip_assignment | high | The clause assigns IP specifically for deliverables of this project and explicitly retains ownership of pre-existing tools and frameworks while granting a license, which aligns with the standard and avoids the listed risk patterns. | Upon full payment, Contractor assigns to Client all right, title, and interest in the final deliverables created specifically for this project. Contractor retains ownership of any pre-existing tools, code libraries, or frameworks used to create the deliverables, and grants Client a perpetual, royalty-free license to use such pre-existing materials solely as incorporated into the final deliverables. |
| confidentiality | low | The clause establishes mutual confidentiality obligations ('Each party agrees...'), sets a reasonable duration ('three (3) years'), and includes standard carve-outs for public or previously known information. This matches the standard and deviates from none of the risk patterns. | Each party agrees to hold the other party's confidential information in strict confidence and not to disclose it to any third party for a period of three (3) years following the disclosure, except information that is or becomes publicly available through no fault of the receiving party, or that the receiving party can demonstrate it already knew prior to disclosure. |

## Baseline (Ollama, naive prompt)

- The agreement does not specify the process for dispute resolution in case of disagreements between the parties.
- The limitation of liability clause appears to be excessive and may not be enforceable in all jurisdictions.
- The agreement does not include a clear definition of what constitutes a 'material breach' for the purposes of termination.
- The confidentiality clause has a relatively short duration of 3 years, which may not be sufficient for a project of this nature.
- The agreement does not specify what constitutes 'Client acceptance' for the purpose of final delivery and payment.
- The interest rate of 1.5% per month for unpaid invoices may be considered high and may not be in line with industry standards.
- The agreement does not specify what happens to the intellectual property rights if the project is terminated early.
