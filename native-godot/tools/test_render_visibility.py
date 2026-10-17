#!/usr/bin/env python3
"""Offline regression for capture selection without changing acceptance criteria."""
import tempfile
import unittest
from pathlib import Path
from PIL import Image
from verify_render_visibility import choose_hobbiton, inspect, visible, verify

def checker(path: Path, lively: bool) -> None:
    image=Image.new("RGB",(160,90))
    if lively:
        for y in range(90):
            for x in range(160):
                image.putpixel((x,y),((x*3+y)%256,(x+y*4)%256,(x*2+y*2)%256))
    else:
        for y in range(90):
            for x in range(160):
                image.putpixel((x,y),(64,85,61))
    image.save(path)

class TestRenderGate(unittest.TestCase):
    def test_bad_view_rejected_without_looser_thresholds(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            for i in range(5):
                checker(root/f"in_engine_hobbiton_candidate_{i}.png",False)
            with self.assertRaisesRegex(ValueError,"All real Hobbiton"):
                choose_hobbiton(root)
            self.assertFalse((root/"in_engine_hobbiton.png").exists())
    def test_one_real_good_view_is_selected(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            for i in range(5):
                checker(root/f"in_engine_hobbiton_candidate_{i}.png",i==3)
            chosen=choose_hobbiton(root)
            self.assertEqual(chosen.name,"in_engine_hobbiton_candidate_3.png")
            self.assertTrue(visible(inspect(root/"in_engine_hobbiton.png")))
            checker(root/"in_engine_bagend.png",True)
            checker(root/"in_engine_cottage.png",True)
            self.assertEqual(verify(root),0)
    def test_missing_diagnostic_images_fail_closed(self):
        with tempfile.TemporaryDirectory() as temp:
            with self.assertRaisesRegex(ValueError,"Expected >=4"):
                choose_hobbiton(Path(temp))
    def test_one_flawed_interior_rejects_entire_release(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            for i in range(5):
                checker(root/f"in_engine_hobbiton_candidate_{i}.png",i==1)
            checker(root/"in_engine_bagend.png",False)
            checker(root/"in_engine_cottage.png",True)
            self.assertEqual(verify(root),1)
if __name__=="__main__":
    unittest.main()
