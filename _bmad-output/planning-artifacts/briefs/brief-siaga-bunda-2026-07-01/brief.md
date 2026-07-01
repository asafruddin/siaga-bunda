---
title: SiAGA Bunda Product Brief
status: draft
created: 2026-07-01
updated: 2026-07-01
---

# SiAGA Bunda Product Brief

## Executive summary

SiAGA Bunda is a mobile education and research-support product for pregnant participants and researchers. It presents seven videos about pregnancy danger signs in a controlled sequence: pretest, complete video viewing, a seven-day wait, posttest, then access to the next video. A mobile-first researcher experience monitors participation and exports study data.

The opportunity is credible but the product premise needs tightening. Enforced sequencing can improve protocol adherence; it does **not** by itself establish comprehension, clinical benefit, measurement validity, or research validity. The MVP should therefore be treated as a study instrument with participant-safety obligations—not as a clinically validated intervention—and should not launch until the study protocol, ethics approval, consent model, data-governance plan, and clinical content review are resolved.

## Problem and intended outcome

Pregnant people need understandable, actionable education about danger signs, while a research team needs reliable evidence of what content each participant was exposed to and when. Existing education may be inconsistent, hard to measure, or disconnected from the study schedule. The desired outcome is a usable learning journey that preserves participant autonomy and produces auditable study data.

The blueprint assumes that forced completion solves the research problem. That is only partly true: no-skip controls can document exposure, but cannot prove attention or understanding and may increase dropout, exclusion bias, shared-device friction, or accessibility problems. These effects must be measured rather than treated as edge cases.

## Users and value

- **Pregnant participant:** receives simple, low-literacy-friendly education, sees progress and test availability, and knows what to do if symptoms may require urgent care. Participation must remain voluntary, including the ability to withdraw without penalty.
- **Researcher:** monitors protocol milestones, deviations, missing data, and aggregate results from a mobile interface without being able to alter source responses or scores.
- **Study and clinical owners:** approve the protocol, instruments, content, safety language, and data handling; review deviations and adverse events. These accountable roles are missing from the blueprint.

`[ASSUMPTION]` The first deployment is an Indonesian research study involving adults who can provide their own informed consent. If minors or participants needing supported consent are eligible, the consent and safeguarding model changes materially.

## Product proposition

The respondent app guides registration, informed consent, pretest, video viewing, delayed posttest, and sequential progression. It records auditable events and provides a non-notification route to discover available posttests. The researcher surface provides role-restricted monitoring and controlled exports.

The product is educational and research-facing. It must not diagnose, triage, reassure, or replace antenatal or emergency care. Danger-sign content needs a persistent, clinically approved escalation path that tells users where and how to seek care; study completion must never delay care.

## MVP boundary

**Include:** respondent onboarding and consent; minimum necessary participant/pregnancy data; seven protocol-approved learning modules; validated pre/post instruments; resilient viewing and timestamp capture; server-authoritative scheduling and progression; reminders with privacy-safe defaults; withdrawal handling; role-based researcher monitoring; pseudonymized export; immutable audit events; accessibility, low-connectivity, and protocol-deviation states.

**Exclude:** diagnosis, personalized medical advice, clinical monitoring, telemedicine, chat, AI assistant, community features, payments, and claims of improved health outcomes. Rich medical histories, exact address, husband support, and birth history should be excluded unless each field is justified by the approved protocol and analysis plan.

## Success criteria

Success is not simply “all users finish.” Before pilot launch, the study owner should set thresholds and denominators for:

- informed-consent comprehension and voluntary enrollment;
- completion and time-to-completion by module, including reasons for withdrawal or protocol deviation;
- pre/post instrument completeness and prespecified knowledge-change analysis;
- video-progress reconciliation after app closure, poor connectivity, clock changes, and device changes;
- reminder delivery **and** dashboard discovery, without disclosing pregnancy or study details on lock screens;
- zero unauthorized access or exports, plus tested incident response and withdrawal/data-disposition workflows;
- clinical review coverage, content version traceability, and successful urgent-care pathway testing.

No clinical-effectiveness or research-validity claim should be made until the protocol defines the endpoint, analysis method, sample, missing-data treatment, and acceptable attrition.

## Decisions required before build commitment

1. **Research:** What is the hypothesis and primary endpoint? Why exactly seven videos and a seven-day interval? Are pre/post questions validated or merely authored for this app? How will repeated exposure, attrition, protocol deviations, and missing data be handled?
2. **Ethics and consent:** Which accredited ethics committee approves the study? What do participants learn about purpose, procedures, risks, benefits, data use, contact points, compensation, withdrawal, and data disposition? Is consent separated from optional notification and secondary-data uses?
3. **Privacy:** Who is the data controller, what is the lawful basis for each processing purpose, what data is genuinely necessary, how long is it kept, where is it hosted, and who receives exports? What are the deletion, correction, access, breach, vendor, and cross-border-transfer procedures?
4. **Clinical safety:** Who clinically approves content and emergency instructions? How are content versions, review dates, escalation contacts, and safety incidents governed? What happens when a participant reports or recognizes a danger sign inside the app?
5. **Participant experience:** Can users pause or withdraw without being trapped by the sequence? What accessibility, language, shared-device, notification-permission, device-loss, and low-connectivity cases must the pilot support?

## Launch gates

Proceed to a limited pilot only after: protocol and statistical analysis approval; ethics approval; clinically signed-off content and escalation copy; documented privacy impact and data-flow review; consent usability testing; security threat modeling; instrument and calculation verification; and rehearsed incident, withdrawal, and export controls. Broader release depends on pilot evidence that the flow is usable, safe, and fit for the approved research purpose.

## Evidence posture

The source is the project [blueprint](../../../../docs/blueprint.md), not user or clinical research. Current Indonesian law treats health information as specific personal data, so detailed data-controller obligations require legal review under [Law No. 27 of 2022](https://peraturan.bpk.go.id/Details/229798/uu-no-27-). Health-research consent and ethics design should be checked against the Ministry of Health’s [national ethics guidance](https://repository.badankebijakan.kemkes.go.id/id/eprint/4214/) and the applicable health-law framework, including [Law No. 17 of 2023](https://peraturan.bpk.go.id/Details/258028/uu) and [Government Regulation No. 28 of 2024](https://peraturan.bpk.go.id/Details/294077). These references identify validation work; they are not a compliance determination.
