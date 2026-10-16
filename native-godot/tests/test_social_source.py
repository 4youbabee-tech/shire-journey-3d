#!/usr/bin/env python3
"""Static social-system integrity checks, NOT engine execution."""
from pathlib import Path
p=Path(__file__).resolve().parents[1]
a=(p/'scripts/shire_social.gd').read_text()
b=(p/'scripts/main.gd').read_text()
checks={
 'social_resource': 'class_name ShireSocial' in a,
 'social_persistence':'func pack()' in a and 'func unpack(raw:' in a,
 'bounded_memory':'MEM_LIMIT := 32' in a,
 'social_context':'func tone(' in a and 'func reply(' in a,
 'friendship':'relationship_change(' in a,
 'side_favours':'favours[id] = "done"' in a,
 'no_llm_dependency':'http://' not in a and 'https://' not in a,
 'journal':'func _toggle_journal()' in b,
 'landmarks':'const LANDMARKS =' in b,
 'discovery_update':'_landmark_update(dt)' in b,
 'npc_integration':'social.reply(talking,topic' in b,
 'save_backward_compatible':'social.unpack(raw.get("social",{}))' in b,
 'single_script_binding':b.count('const SocialScript=')==1,
 'single_social_state':b.count('var social:')==1,
 'no_duplicate_social_save':'"social":social.pack()' in b and b.count('"social":social.pack()')==1,
}
for name,ok in checks.items():print(('PASS' if ok else 'FAIL')+' '+name)
assert all(checks.values())
print(f'PASS {len(checks)}/{len(checks)} source integrity checks; Godot runtime required separately')