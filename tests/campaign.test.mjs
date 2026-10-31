import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPAIGN_CHAPTERS,CAMPAIGN_REGIONS,CHAPTER_BY_ID,canAdvanceChapter,activateChapter,createChapterProgress} from '../dist/campaign.mjs';
test('the complete trilogy campaign contains all 23 ordered chapter dossiers',()=>{
 assert.equal(CAMPAIGN_CHAPTERS.length,23);
 assert.equal(new Set(CAMPAIGN_CHAPTERS.map(c=>c.id)).size,23);
 for(const c of CAMPAIGN_CHAPTERS){assert.ok(c.title&&c.beat&&c.outcome);for(const region of c.regions)assert.ok(CAMPAIGN_REGIONS.some(r=>r.id===region),c.id+' missing region '+region);for(const next of c.next)assert.ok(CHAPTER_BY_ID[next],c.id+' points to unknown '+next);}
 assert.deepEqual(CHAPTER_BY_ID['F1-08'].next,['F2-01','F2-06']);
 assert.deepEqual(CHAPTER_BY_ID['F3-01'].requires,['F2-07','F2-08']);
 assert.equal(CHAPTER_BY_ID['F3-07'].evidence,'FILM-CANON/MASTER-SUMMARY');
});
test('campaign transitions enforce the Ring handoff, Shire departure and parallel-lane synchronization',()=>{
 const s={storyChapterId:'F1-01',chapterProgress:createChapterProgress('F1-01'),canonicalOutcomeFlags:{ringPassed:false,frodoDeparted:false}};
 assert.equal(canAdvanceChapter(s,'F1-02'),false);
 s.canonicalOutcomeFlags.ringPassed=true;assert.equal(activateChapter(s,'F1-02'),true);assert.equal(s.storyChapterId,'F1-02');
 assert.equal(canAdvanceChapter(s,'F1-03'),false);
 s.canonicalOutcomeFlags.frodoDeparted=true;assert.equal(activateChapter(s,'F1-03'),true);assert.equal(s.storyChapterId,'F1-03');
 s.storyChapterId='F1-08';s.chapterProgress['F1-08']='active';assert.equal(canAdvanceChapter(s,'F2-01'),false);
 s.canonicalOutcomeFlags.ringPassed=true;assert.equal(canAdvanceChapter(s,'F2-01'),false);s.canonicalOutcomeFlags.fellowshipBroken=true;assert.equal(canAdvanceChapter(s,'F2-01'),true);assert.equal(canAdvanceChapter(s,'F2-06'),true);
 s.storyChapterId='F2-07';s.chapterProgress['F2-07']='complete';assert.equal(canAdvanceChapter(s,'F3-01'),false);
 s.chapterProgress['F2-08']='complete';assert.equal(canAdvanceChapter(s,'F3-01'),true);
});
test('Middle-earth regions include all major biomes from the Shire to the Grey Havens',()=>{
 const ids=new Set(CAMPAIGN_REGIONS.map(r=>r.id));
 for(const id of ['shire','buckland','bree','rivendell','moria','lothlorien','fangorn','helms-deep','isengard','minas-tirith','pelennor','mordor','mount-doom','grey-havens'])assert.ok(ids.has(id));
});
