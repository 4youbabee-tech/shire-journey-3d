#!/usr/bin/env python3
"""Audit release evidence across every chapter. Never turn a green CI into 'AAA complete'."""
import argparse, json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
GATES=["characters","animation","environment","architecture_interiors","materials_lighting_camera","audio_voice","npc_narrative","gameplay_polish","performance_stability","legal_packaging"]
def validate(path, require_final):
    doc=json.loads(path.read_text(encoding="utf-8"))
    failures=[]
    chapters=doc.get("chapters",{})
    if not chapters: failures.append("no chapters registered")
    for chapter_id, chapter in chapters.items():
        section=chapter.get("gates",{})
        if set(section)!=set(GATES):
            failures.append(f"{chapter_id}: missing or unexpected quality gates")
        for gate in GATES:
            evidence=section.get(gate,{})
            state=evidence.get("state","pending")
            if state not in ("pending","in_progress","approved","blocked"):
                failures.append(f"{chapter_id}/{gate}: invalid state")
            if state=="approved" and (not evidence.get("reviewer") or not evidence.get("evidence")):
                failures.append(f"{chapter_id}/{gate}: approval missing reviewer or evidence")
            if require_final and state!="approved":
                failures.append(f"{chapter_id}/{gate}: not approved")
        if require_final and chapter.get("status")!="final":
            failures.append(f"{chapter_id}: chapter not accepted as final")
    if require_final and (doc.get("whole_game",{}).get("state")!="approved" or not doc.get("whole_game",{}).get("end_to_end_evidence")):
        failures.append("whole game continuity and end-to-end playthrough not approved")
    return failures

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--require-final",action="store_true")
    options=parser.parse_args()
    problems=validate(ROOT/"production/quality/chapter_acceptance.json",options.require_final)
    if problems:
        for issue in problems: print("QUALITY GATE:",issue,file=sys.stderr)
        sys.exit(1)
    print("Quality contract valid.", "FINAL accepted." if options.require_final else "Candidate status only; no cinematic approval implied.")
