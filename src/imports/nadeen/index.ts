// Nadeen — the illustrated guide through the BackSoon story.
// Sliced from the brand storyboard sketch (src/imports/image.png).
import hero from './hero.webp';
import goingAway from './01-going-away.webp';
import theProblem from './02-the-problem.webp';
import theSearch from './03-the-search.webp';
import backsoon from './04-backsoon.webp';
import theMatch from './05-the-match.webp';
import theCoverage from './06-the-coverage.webp';
import sheGoes from './07-she-goes.webp';
import shesBack from './08-shes-back.webp';

export const nadeenHero = hero;

export interface StoryBeat {
  img: string;
  step: string;
  title: string;
  caption: string;
}

export const storyBeats: StoryBeat[] = [
  { img: goingAway, step: '01', title: 'Going away', caption: 'Nadeen heads home to see family for three weeks.' },
  { img: theProblem, step: '02', title: 'The problem', caption: 'But her waitress shifts are still on the calendar.' },
  { img: theSearch, step: '03', title: 'The search', caption: 'She messages everyone. “No one is available…”' },
  { img: backsoon, step: '04', title: 'BackSoon', caption: 'So she posts the shifts on BackSoon instead.' },
  { img: theMatch, step: '05', title: 'The match', caption: 'Verified students appear — a 92% match tops the list.' },
  { img: theCoverage, step: '06', title: 'The coverage', caption: 'The hotel picks one. The shift is covered.' },
  { img: sheGoes, step: '07', title: 'She goes', caption: 'Nadeen leaves, knowing work is in good hands.' },
  { img: shesBack, step: '08', title: 'She’s back', caption: 'Three weeks later, her shifts are hers again.' },
];
