export interface LyricLine {
  start: number;
  end: number;
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  durationSec: number;
  audioFile: string;
  coverFile: string;
  bpm: string;
  model: string;
  story: string;
  lyrics: LyricLine[];
}

export const properMadTracks: Track[] = [
  {
    "id": "the-road-beyond",
    "title": "The Road Beyond",
    "artist": "Linacre",
    "album": "Proper Mad",
    "genre": "Acoustic Grime Rap / UK Storytelling",
    "duration": "3:42",
    "durationSec": 222.46,
    "audioFile": "music/tracks/the-road-beyond.mp3",
    "coverFile": "music/covers/the-road-beyond.jpg",
    "bpm": "90 BPM",
    "model": "Suno V6-MINI",
    "story": "An acoustic grime-rap ballad delivering an honest, rhythmic UK storytelling flow. Dedicated to Jessica at 15, addressing the real struggles she has endured and reminding her that she is not the wreckage, she is the road beyond.",
    "lyrics": [
      {
        "start": 10,
        "end": 12.36,
        "text": "Fifteen with a lifetime folded in your coat,"
      },
      {
        "start": 12.36,
        "end": 15,
        "text": "Jess, you learned to swim before you learned to float."
      },
      {
        "start": 15,
        "end": 17.7,
        "text": "Callum took a different road, went living with his dad,"
      },
      {
        "start": 17.7,
        "end": 21.12,
        "text": "Then Jodie found another love, and the home got rearranged."
      },
      {
        "start": 21.12,
        "end": 23.8,
        "text": "Jack came laughing, little brother bright-eyed in the hall,"
      },
      {
        "start": 23.8,
        "end": 26.46,
        "text": "Then his dad got locked away, left a silence on the wall."
      },
      {
        "start": 26.46,
        "end": 29.16,
        "text": "When he came back, the truth came crashing through the room,"
      },
      {
        "start": 29.16,
        "end": 32.02,
        "text": "A cheating heart can turn a house into a tomb."
      },
      {
        "start": 32.02,
        "end": 34.58,
        "text": "You kept your head up though the nights were long,"
      },
      {
        "start": 34.58,
        "end": 37.34,
        "text": "Kept a little ember when the world felt wrong."
      },
      {
        "start": 37.34,
        "end": 39.84,
        "text": "Every tear you swallowed left a silver mark,"
      },
      {
        "start": 39.84,
        "end": 42.98,
        "text": "But there's still a beating drum inside your heart."
      },
      {
        "start": 42.98,
        "end": 45.96,
        "text": "Jess, you're not the wreckage, you're the road beyond,"
      },
      {
        "start": 45.96,
        "end": 48.78,
        "text": "Not the things they took, but the strength you're standing on."
      },
      {
        "start": 48.78,
        "end": 51.36,
        "text": "Fifteen years and fearless, even when you're scared,"
      },
      {
        "start": 51.36,
        "end": 54.24,
        "text": "You've been through the fire, but you're still right there."
      },
      {
        "start": 54.24,
        "end": 56.96,
        "text": "Jess, let the future find you, let the hard days bend,"
      },
      {
        "start": 56.96,
        "end": 59.8,
        "text": "You and David raising glasses, talking like friends."
      },
      {
        "start": 59.8,
        "end": 62.2,
        "text": "From the flooded eyes to skies of blue,"
      },
      {
        "start": 62.2,
        "end": 64.96,
        "text": "There's a brighter chapter waiting just for you."
      },
      {
        "start": 64.96,
        "end": 69.68,
        "text": "Jodie got sick, and the whole world changed its name,"
      },
      {
        "start": 69.68,
        "end": 72.32,
        "text": "Cancer took her slowly, left a candle in the rain."
      },
      {
        "start": 72.32,
        "end": 75.08,
        "text": "One year later, Mum was gone, too young to say goodbye,"
      },
      {
        "start": 75.08,
        "end": 77.74,
        "text": "And Jack went to his father while you learned not to cry."
      },
      {
        "start": 77.74,
        "end": 80.32,
        "text": "Two months passed, then Skida died, your dad was gone as well,"
      },
      {
        "start": 80.32,
        "end": 83.08,
        "text": "Another empty chair, another story you could tell."
      },
      {
        "start": 83.08,
        "end": 85.9,
        "text": "Now Bonny keeps you close, Nannan holds the line,"
      },
      {
        "start": 85.9,
        "end": 88.64,
        "text": "While school feels like a mountain every single morning time."
      },
      {
        "start": 88.64,
        "end": 91.54,
        "text": "But you're more than every absence, more than every loss,"
      },
      {
        "start": 91.54,
        "end": 94.24,
        "text": "More than all the broken roads and everything they cost."
      },
      {
        "start": 94.24,
        "end": 97,
        "text": "When the hallway feels too narrow, when the lessons feel unfair,"
      },
      {
        "start": 97,
        "end": 99.88,
        "text": "Remember, Jess, your future's bigger than that chair."
      },
      {
        "start": 99.88,
        "end": 102.88,
        "text": "Jess, you're not the wreckage, you're the road beyond,"
      },
      {
        "start": 102.88,
        "end": 105.72,
        "text": "Not the things they took, but the strength you're standing on."
      },
      {
        "start": 105.72,
        "end": 108.28,
        "text": "Fifteen years and fearless, even when you're scared,"
      },
      {
        "start": 108.28,
        "end": 111.18,
        "text": "You've been through the fire, but you're still right there."
      },
      {
        "start": 111.18,
        "end": 113.9,
        "text": "Jess, let the future find you, let the hard days bend,"
      },
      {
        "start": 113.9,
        "end": 116.72,
        "text": "You and David raising glasses, talking like friends."
      },
      {
        "start": 116.72,
        "end": 119.18,
        "text": "From the flooded eyes to skies of blue,"
      },
      {
        "start": 119.18,
        "end": 121.88,
        "text": "There's a brighter chapter waiting just for you."
      },
      {
        "start": 121.88,
        "end": 124.46,
        "text": "Next door, the garden centre wears a friendly face,"
      },
      {
        "start": 124.46,
        "end": 127.18,
        "text": "But Fake Grandad makes you feel unsafe in that place."
      },
      {
        "start": 127.18,
        "end": 130,
        "text": "You know where his eyes go, and it makes you mad,"
      },
      {
        "start": 130,
        "end": 132.86,
        "text": "Makes you sad, makes your whole body feel bad."
      },
      {
        "start": 132.86,
        "end": 135.28,
        "text": "Jess, it isn't yours to carry, none of that shame,"
      },
      {
        "start": 135.28,
        "end": 137.98,
        "text": "Tell Bonny, tell a teacher, put a boundary on his name."
      },
      {
        "start": 137.98,
        "end": 140.82,
        "text": "Stay with people who believe you, keep the door in sight,"
      },
      {
        "start": 140.82,
        "end": 143.42,
        "text": "You deserve to feel protected every day and night."
      },
      {
        "start": 143.42,
        "end": 146.14,
        "text": "And the money in the family has a history of pain,"
      },
      {
        "start": 146.14,
        "end": 148.86,
        "text": "David helped to build it through the sun and through the rain."
      },
      {
        "start": 148.86,
        "end": 151.4,
        "text": "Worked like somebody's servant, gave his whole life away,"
      },
      {
        "start": 151.4,
        "end": 153.88,
        "text": "Then got tossed aside and told, 'You're not my real son today.'"
      },
      {
        "start": 153.88,
        "end": 156.62,
        "text": "But blood can't buy a brother, and a name can't make a home,"
      },
      {
        "start": 156.62,
        "end": 159.34,
        "text": "David knows the road you're on, so you don't walk alone."
      },
      {
        "start": 159.34,
        "end": 162,
        "text": "After years of flooding tears, two beers and honest talk,"
      },
      {
        "start": 162,
        "end": 164.78,
        "text": "A little light came through the cracks, a little room to walk."
      },
      {
        "start": 164.78,
        "end": 167.82,
        "text": "No more keeping quiet just to keep the peace,"
      },
      {
        "start": 167.82,
        "end": 170.5,
        "text": "No more making smaller what you feel and need."
      },
      {
        "start": 170.5,
        "end": 173.34,
        "text": "If the dark comes knocking, let the good ones know,"
      },
      {
        "start": 173.34,
        "end": 176.3,
        "text": "You are not alone here, and you're not a ghost."
      },
      {
        "start": 176.3,
        "end": 178.78,
        "text": "Jess, you're not the wreckage, you're the road beyond,"
      },
      {
        "start": 178.78,
        "end": 181.62,
        "text": "Not the things they took, but the strength you're standing on."
      },
      {
        "start": 181.62,
        "end": 184.38,
        "text": "Fifteen years and fearless, even when you're scared,"
      },
      {
        "start": 184.38,
        "end": 187.12,
        "text": "You've been through the fire, but you're still right there."
      },
      {
        "start": 187.12,
        "end": 189.86,
        "text": "Jess, let the future find you, let the hard days bend,"
      },
      {
        "start": 189.86,
        "end": 192.76,
        "text": "You and David raising glasses, talking like friends."
      },
      {
        "start": 192.76,
        "end": 195.1,
        "text": "From the flooded eyes to skies of blue,"
      },
      {
        "start": 195.1,
        "end": 198,
        "text": "There's a brighter chapter waiting just for you."
      },
      {
        "start": 198,
        "end": 200.42,
        "text": "Jessica, breathe easy, let tomorrow start,"
      },
      {
        "start": 200.42,
        "end": 203.14,
        "text": "Bonny's keeping watch, and you've got a brave heart."
      },
      {
        "start": 203.14,
        "end": 206.1,
        "text": "The past may leave a scar, but it won't decide what's true,"
      },
      {
        "start": 206.1,
        "end": 208.76,
        "text": "There's a brighter chapter waiting, Jess, for you."
      },
      {
        "start": 208.76,
        "end": 214.38,
        "text": "Just for you..."
      },
      {
        "start": 214.38,
        "end": 222.4,
        "text": "Just for you..."
      }
    ]
  },
  {
    "id": "jessica-hold-your-head-up",
    "title": "Jessica, Hold Your Head Up",
    "artist": "Linacre",
    "album": "Proper Mad",
    "genre": "Acoustic Pop-Folk / Contemporary",
    "duration": "4:00",
    "durationSec": 239.98,
    "audioFile": "music/tracks/jessica-hold-your-head-up.mp3",
    "coverFile": "music/covers/jessica-hold-your-head-up.jpg",
    "bpm": "88 BPM",
    "model": "Suno V6-MINI",
    "story": "A deeply moving, uplifting acoustic folk-pop ballad dedicated to Jessica at 15. Through heartbreak, grief, loss, family turmoil, and quiet courage, she and her uncle David share honest talks, beers, and laughter under the porch light—reminding her that the storm has passed and tomorrow belongs to her.",
    "lyrics": [
      {
        "start": 0.62,
        "end": 3.1,
        "text": "Fifteen candles, fifteen years,"
      },
      {
        "start": 3.1,
        "end": 5.58,
        "text": "Still standing tall through storms and tears."
      },
      {
        "start": 5.58,
        "end": 7.88,
        "text": "Callum took a different road,"
      },
      {
        "start": 7.88,
        "end": 10.18,
        "text": "Left a space where memories glowed."
      },
      {
        "start": 10.18,
        "end": 12.72,
        "text": "Then Jack arrived, a little light,"
      },
      {
        "start": 12.72,
        "end": 15.26,
        "text": "While grown-up hearts kept losing sight."
      },
      {
        "start": 15.26,
        "end": 17.63,
        "text": "Doors kept changing, names moved on,"
      },
      {
        "start": 17.63,
        "end": 20,
        "text": "Still you found the strength to carry on."
      },
      {
        "start": 20,
        "end": 22.87,
        "text": "You learned too young what goodbyes mean,"
      },
      {
        "start": 22.87,
        "end": 25.74,
        "text": "But kept a spark beneath the rain."
      },
      {
        "start": 25.74,
        "end": 27.64,
        "text": "And every scar you never show"
      },
      {
        "start": 27.64,
        "end": 30.38,
        "text": "Is proof of how much you have grown."
      },
      {
        "start": 30.38,
        "end": 33.54,
        "text": "Jessica, hold your head up high,"
      },
      {
        "start": 33.54,
        "end": 36.18,
        "text": "You've got tomorrow in your eyes."
      },
      {
        "start": 36.18,
        "end": 38.22,
        "text": "From every tear and every test,"
      },
      {
        "start": 38.22,
        "end": 40.78,
        "text": "You're still becoming your very best."
      },
      {
        "start": 40.78,
        "end": 43.38,
        "text": "With Bonny's arms and David's words,"
      },
      {
        "start": 43.38,
        "end": 45.7,
        "text": "A little hope can move the world."
      },
      {
        "start": 45.7,
        "end": 48.22,
        "text": "The road is wide, the sky is blue,"
      },
      {
        "start": 48.22,
        "end": 51.38,
        "text": "There's brighter days belonging to you."
      },
      {
        "start": 51.38,
        "end": 55,
        "text": "Jack's dad disappeared behind a wall,"
      },
      {
        "start": 55,
        "end": 59.9,
        "text": "Came back with promises that couldn't stand at all."
      },
      {
        "start": 59.9,
        "end": 62.4,
        "text": "Your mum Jodie fought with all her might,"
      },
      {
        "start": 62.4,
        "end": 65.04,
        "text": "Then left her love inside your life."
      },
      {
        "start": 65.04,
        "end": 67.44,
        "text": "A year of courage, a year of pain,"
      },
      {
        "start": 67.44,
        "end": 70.02,
        "text": "Her name still falls like summer rain."
      },
      {
        "start": 70.02,
        "end": 72.34,
        "text": "Jack found shelter somewhere new,"
      },
      {
        "start": 72.34,
        "end": 75,
        "text": "And then Skida slipped away from you."
      },
      {
        "start": 75,
        "end": 78.12,
        "text": "Two months later, another goodbye,"
      },
      {
        "start": 78.12,
        "end": 80.56,
        "text": "Too much weight for a fifteen-year life."
      },
      {
        "start": 80.56,
        "end": 83.02,
        "text": "But through the ache, through every bend,"
      },
      {
        "start": 83.02,
        "end": 85.72,
        "text": "You found a home where hearts can mend."
      },
      {
        "start": 85.72,
        "end": 88.18,
        "text": "Jessica, hold your head up high,"
      },
      {
        "start": 88.18,
        "end": 90.88,
        "text": "You've got tomorrow in your eyes."
      },
      {
        "start": 90.88,
        "end": 92.9,
        "text": "From every tear and every test,"
      },
      {
        "start": 92.9,
        "end": 95.48,
        "text": "You're still becoming your very best."
      },
      {
        "start": 95.48,
        "end": 98,
        "text": "With Bonny's arms and David's words,"
      },
      {
        "start": 98,
        "end": 100.4,
        "text": "A little hope can move the world."
      },
      {
        "start": 100.4,
        "end": 103.22,
        "text": "The road is wide, the sky is blue,"
      },
      {
        "start": 103.22,
        "end": 106.1,
        "text": "There's brighter days belonging to you."
      },
      {
        "start": 106.1,
        "end": 109.24,
        "text": "School feels heavy, mornings drag,"
      },
      {
        "start": 109.24,
        "end": 112.38,
        "text": "Some days you're walking with a loaded bag."
      },
      {
        "start": 112.38,
        "end": 114.85,
        "text": "But after floods of sleepless tears,"
      },
      {
        "start": 114.85,
        "end": 117.32,
        "text": "You and David face the years."
      },
      {
        "start": 117.32,
        "end": 119.79,
        "text": "A couple beers, a talking night,"
      },
      {
        "start": 119.79,
        "end": 122.26,
        "text": "Small honest jokes, a porch-light bright."
      },
      {
        "start": 122.26,
        "end": 125.93,
        "text": "No perfect map, no magic tune,"
      },
      {
        "start": 125.93,
        "end": 129.6,
        "text": "Just two brave hearts making room."
      },
      {
        "start": 129.6,
        "end": 132.78,
        "text": "Jessica, hold your head up high,"
      },
      {
        "start": 132.78,
        "end": 135.96,
        "text": "You've got tomorrow in your eyes."
      },
      {
        "start": 135.96,
        "end": 137.98,
        "text": "From every tear and every test,"
      },
      {
        "start": 137.98,
        "end": 140.56,
        "text": "You're still becoming your very best."
      },
      {
        "start": 140.56,
        "end": 143.2,
        "text": "With Bonny's arms and David's words,"
      },
      {
        "start": 143.2,
        "end": 145.5,
        "text": "A little hope can move the world."
      },
      {
        "start": 145.5,
        "end": 148.04,
        "text": "The road is wide, the sky is blue,"
      },
      {
        "start": 148.04,
        "end": 150.94,
        "text": "There's brighter days belonging to you."
      },
      {
        "start": 150.94,
        "end": 153.28,
        "text": "Jessica, let the old hurt fade,"
      },
      {
        "start": 153.28,
        "end": 155.74,
        "text": "Look at the life you're gonna make."
      },
      {
        "start": 155.74,
        "end": 158.86,
        "text": "You are more than what went wrong,"
      },
      {
        "start": 158.86,
        "end": 161.76,
        "text": "You are the reason hope stays strong."
      },
      {
        "start": 161.76,
        "end": 166.78,
        "text": "Fifteen years, and still you rise,"
      },
      {
        "start": 166.78,
        "end": 171.96,
        "text": "Brave heart, bright soul, wide-open skies."
      },
      {
        "start": 171.96,
        "end": 176.38,
        "text": "The future's waiting, warm and new,"
      },
      {
        "start": 176.38,
        "end": 181.56,
        "text": "Jessica, it's calling you."
      },
      {
        "start": 181.56,
        "end": 191.86,
        "text": "Jessica, it's calling you..."
      }
    ]
  },
  {
    "id": "barnsley-town",
    "title": "Barnsley Town",
    "artist": "Linacre",
    "album": "Proper Mad",
    "genre": "UK Comedy Pop-Rap / Garage",
    "duration": "3:01",
    "durationSec": 181.45,
    "audioFile": "music/tracks/barnsley-town.mp3",
    "coverFile": "music/covers/barnsley-town.jpg",
    "bpm": "132 BPM",
    "model": "Suno V6-MINI",
    "story": "A bouncy northern council estate comedy pop-rap anthem celebrating Barnsley life, Chambers pub, Creepy Steve by the bins, Bhramahs, mucky women moonwalking, and the iconic Blue da-ba-dee dance breakdown.",
    "lyrics": [
      {
        "start": 0,
        "end": 2.1,
        "text": "Alright, Barnsley Town!"
      },
      {
        "start": 2.52,
        "end": 5.2,
        "text": "Chambers on the corner, Bhramahs in the air"
      },
      {
        "start": 5.68,
        "end": 9.2,
        "text": "Creepy Steve’s by the bins like he’s always been there"
      },
      {
        "start": 9.98,
        "end": 12.28,
        "text": "Council flat kingdom, kettle on the boil"
      },
      {
        "start": 12.32,
        "end": 14.7,
        "text": "Lift smells funny but we’re loyal to the soil"
      },
      {
        "start": 15.02,
        "end": 16.8,
        "text": "Mucky woman’s laughing in a dressing gown"
      },
      {
        "start": 16.8,
        "end": 19.08,
        "text": "Says, “I’ve got class, love” — then she falls straight down"
      },
      {
        "start": 19.08,
        "end": 21.96,
        "text": "Creepy Steve’s got a raincoat and a plastic cup"
      },
      {
        "start": 21.96,
        "end": 24.2,
        "text": "Knows every back door, every shortcut up"
      },
      {
        "start": 24.62,
        "end": 26.24,
        "text": "Bhramahs on the table, crisps in a bowl"
      },
      {
        "start": 26.28,
        "end": 28.21,
        "text": "Weed in the garden, keeping slugs on patrol"
      },
      {
        "start": 28.26,
        "end": 30.56,
        "text": "If the rent’s gone up, we’ll blame the moon"
      },
      {
        "start": 30.6,
        "end": 32.72,
        "text": "If the telly breaks, we’ll fix it with a spoon"
      },
      {
        "start": 32.92,
        "end": 35.28,
        "text": "From the stairwell choir to the busted old van"
      },
      {
        "start": 35.32,
        "end": 38.06,
        "text": "We’re making do, mate — that’s the council plan"
      },
      {
        "start": 38.36,
        "end": 40.44,
        "text": "Crazy cuz, crazy cuz, what you playing at?"
      },
      {
        "start": 40.48,
        "end": 42.72,
        "text": "Mucky woman’s moonwalking in a leopard hat"
      },
      {
        "start": 42.76,
        "end": 45,
        "text": "Barnsley Town, sing it loud, don’t be shy"
      },
      {
        "start": 45.2,
        "end": 47.32,
        "text": "Chambers pub calling, so we’re giving it a try"
      },
      {
        "start": 47.54,
        "end": 49.8,
        "text": "Crazy cuz, crazy cuz, life’s a funny little tune"
      },
      {
        "start": 50.44,
        "end": 51.92,
        "text": "Bhramahs, bits of weed, and a washing line balloon"
      },
      {
        "start": 51.96,
        "end": 53.96,
        "text": "Creepy Steve says, “One more?” — and we all shout, “Course!”"
      },
      {
        "start": 54,
        "end": 57.5,
        "text": "Then we lose the last bus crawling back from Chambers!"
      },
      {
        "start": 62.22,
        "end": 67.42,
        "text": "The hallway’s got a mystery stain with history"
      },
      {
        "start": 67.8,
        "end": 70,
        "text": "Landlord calls it “character,” we call it misery"
      },
      {
        "start": 70.4,
        "end": 72.56,
        "text": "Mucky woman’s got a handbag full of receipts"
      },
      {
        "start": 72.56,
        "end": 75,
        "text": "And a kebab that’s been ageing for three weeks"
      },
      {
        "start": 75.04,
        "end": 77.3,
        "text": "Creepy Steve’s doing parkour by the bin store"
      },
      {
        "start": 77.56,
        "end": 79.6,
        "text": "Missed the landing, now he’s knocking on floor four"
      },
      {
        "start": 79.98,
        "end": 81.9,
        "text": "Bhramahs makes the wisdom seem surprisingly deep"
      },
      {
        "start": 82.14,
        "end": 84.1,
        "text": "“Never trust a pigeon that refuses to sleep”"
      },
      {
        "start": 84.32,
        "end": 86.74,
        "text": "The neighbour’s got a barbecue made from a chair"
      },
      {
        "start": 86.74,
        "end": 88.74,
        "text": "Someone’s growing herbs in the communal air"
      },
      {
        "start": 88.78,
        "end": 91.22,
        "text": "We’ve got big dreams and a tiny front room"
      },
      {
        "start": 91.26,
        "end": 93.5,
        "text": "But the bass through the ceiling makes the whole block boom"
      },
      {
        "start": 93.78,
        "end": 95.9,
        "text": "Crazy cuz, crazy cuz, what you playing at?"
      },
      {
        "start": 96.08,
        "end": 98.2,
        "text": "Mucky woman’s moonwalking in a leopard hat"
      },
      {
        "start": 98.4,
        "end": 100.62,
        "text": "Barnsley Town, sing it loud, don’t be shy"
      },
      {
        "start": 100.62,
        "end": 102.8,
        "text": "Chambers pub calling, so we’re giving it a try"
      },
      {
        "start": 103,
        "end": 105.3,
        "text": "Crazy cuz, crazy cuz, life’s a funny little tune"
      },
      {
        "start": 105.58,
        "end": 107.3,
        "text": "Bhramahs, bits of weed, and a washing line balloon"
      },
      {
        "start": 107.34,
        "end": 109.4,
        "text": "Creepy Steve says, “One more?” — and we all shout, “Course!”"
      },
      {
        "start": 109.44,
        "end": 112.5,
        "text": "Then we lose the last bus crawling back from Chambers!"
      },
      {
        "start": 112.6,
        "end": 126.5,
        "text": "♪ (Da-ba-dee, da-ba-da, da-ba-dee, da-ba-da...) ♪"
      },
      {
        "start": 126.6,
        "end": 141.5,
        "text": "♪ (Da-ba-dee, da-ba-da, da-ba-dee, da-ba-da!) ♪"
      },
      {
        "start": 142.36,
        "end": 144.2,
        "text": "Crazy cuz, crazy cuz, clap along with that"
      },
      {
        "start": 144.2,
        "end": 146.46,
        "text": "Mucky woman’s singing through a borrowed megaphone hat"
      },
      {
        "start": 146.6,
        "end": 148.76,
        "text": "Barnsley Town, raise the roof, let it fly"
      },
      {
        "start": 148.76,
        "end": 151.2,
        "text": "We’re too skint for taxis but we still get by"
      },
      {
        "start": 151.46,
        "end": 153.66,
        "text": "Crazy cuz, crazy cuz, laughing at the doom"
      },
      {
        "start": 153.66,
        "end": 155.72,
        "text": "Weed by the window, Bhramahs in the room"
      },
      {
        "start": 155.84,
        "end": 158.18,
        "text": "Creepy Steve says, “Last one!” — we all know the score"
      },
      {
        "start": 158.18,
        "end": 161.32,
        "text": "Then we’re dancing in the drizzle outside Chambers’ door!"
      },
      {
        "start": 161.32,
        "end": 163.58,
        "text": "Barnsley Town, council crown"
      },
      {
        "start": 163.58,
        "end": 165.64,
        "text": "Creepy Steve, don’t let us down"
      },
      {
        "start": 165.86,
        "end": 168.24,
        "text": "Bhramahs, weed, and a night outdoors"
      },
      {
        "start": 168.24,
        "end": 171.16,
        "text": "See you next week, same time, same Chambers!"
      },
      {
        "start": 171.2,
        "end": 180.68,
        "text": "♪ Chambers... Chambers! ♪"
      }
    ]
  },
  {
    "id": "skint-dave",
    "title": "Skint Dave from Barnsley",
    "artist": "Linacre",
    "album": "Proper Mad",
    "genre": "British Indie Rock / Pub-Singalong",
    "duration": "3:41",
    "durationSec": 221.2,
    "audioFile": "music/tracks/skint-dave.mp3",
    "coverFile": "music/covers/skint-dave.jpg",
    "bpm": "96 BPM",
    "model": "Suno V6-MINI",
    "story": "A warm northern character anthem about daily struggles, ADHD weather, leaking washing machines, hearing aids, and the stubborn spirit of Dave from Barnsley refusing to give in.",
    "lyrics": [
      {
        "start": 0,
        "end": 4.54,
        "text": "Morning sticks to the curtains, kettle takes its time"
      },
      {
        "start": 9.14,
        "end": 12.5,
        "text": "Fester guards the toolbox, Ralf is stealing mine"
      },
      {
        "start": 15.32,
        "end": 18.4,
        "text": "Nic says, “You’ve got a plan then?” I say, “I’ve got a few”"
      },
      {
        "start": 18.94,
        "end": 22.85,
        "text": "There’s a chair that needs repairing and a shed that wants me too"
      },
      {
        "start": 22.9,
        "end": 24.24,
        "text": "My left side’s playing hide-and-seek"
      },
      {
        "start": 26.3,
        "end": 30.18,
        "text": "The batteries chirp when I try to speak"
      },
      {
        "start": 30.72,
        "end": 34.2,
        "text": "The room keeps ringing like a shop alarm"
      },
      {
        "start": 34.58,
        "end": 38.6,
        "text": "Still I pull my boots on, still I mean no harm"
      },
      {
        "start": 39.52,
        "end": 43.39,
        "text": "I’m skint, Dave from Barnsley, counting pennies by the sink"
      },
      {
        "start": 43.44,
        "end": 47.31,
        "text": "Body coming loose at the seams, but I’m not done, I think"
      },
      {
        "start": 47.36,
        "end": 51.02,
        "text": "Fester, Ralf and Nic keep pulling me through"
      },
      {
        "start": 51.02,
        "end": 55.21,
        "text": "Every daft little project is a road I can choose"
      },
      {
        "start": 55.26,
        "end": 58.72,
        "text": "If the day says no, I’ll have another go"
      },
      {
        "start": 59.08,
        "end": 63.9,
        "text": "There’s a small light somewhere and I’m learning where it goes"
      },
      {
        "start": 66.6,
        "end": 70.54,
        "text": "Ramsey Hunt left a calling card beside my tired eye"
      },
      {
        "start": 70.8,
        "end": 74.48,
        "text": "Hearing aid whistles back whenever buses pass me by"
      },
      {
        "start": 75.56,
        "end": 78.33,
        "text": "Tinnitus fills the quiet, sleep forgets my name"
      },
      {
        "start": 78.38,
        "end": 81.93,
        "text": "I wake up feeling ninety, then I try the game again"
      },
      {
        "start": 81.98,
        "end": 84.99,
        "text": "The washing machine is leaking by the door"
      },
      {
        "start": 85.04,
        "end": 88.43,
        "text": "My knees have started arguing with the floor"
      },
      {
        "start": 89.46,
        "end": 92.08,
        "text": "Nic puts tea beside me, says, “Don’t make it grand”"
      },
      {
        "start": 92.94,
        "end": 97.3,
        "text": "So I draw another sketch with a pencil in my hand"
      },
      {
        "start": 97.86,
        "end": 101.42,
        "text": "I’m skint, Dave from Barnsley, counting pennies by the sink"
      },
      {
        "start": 101.86,
        "end": 105.32,
        "text": "Body coming loose at the seams, but I’m not done, I think"
      },
      {
        "start": 106.66,
        "end": 109.14,
        "text": "Fester, Ralf and Nic keep pulling me through"
      },
      {
        "start": 109.14,
        "end": 113.21,
        "text": "Every daft little project is a road I can choose"
      },
      {
        "start": 113.26,
        "end": 116.76,
        "text": "If the day says no, I’ll have another go"
      },
      {
        "start": 117.02,
        "end": 121.88,
        "text": "There’s a small light somewhere and I’m learning where it goes"
      },
      {
        "start": 124.3,
        "end": 128.5,
        "text": "One plan for a planter, one plan for a shelf"
      },
      {
        "start": 129.08,
        "end": 132.58,
        "text": "Three half-built inventions scattered round myself"
      },
      {
        "start": 133.02,
        "end": 136.61,
        "text": "ADHD weather, thunder in my head"
      },
      {
        "start": 136.66,
        "end": 140.45,
        "text": "But Nic finds the missing screw beneath the bed"
      },
      {
        "start": 140.5,
        "end": 144.58,
        "text": "I turn the power on and something starts to hum"
      },
      {
        "start": 144.86,
        "end": 150.02,
        "text": "Not the ringing in my ears this time—something I have done"
      },
      {
        "start": 152.88,
        "end": 157.14,
        "text": "I’m skint, Dave from Barnsley, but the numbers start to change"
      },
      {
        "start": 157.48,
        "end": 161.62,
        "text": "That little thing I built today has found its way to someone’s place"
      },
      {
        "start": 162.14,
        "end": 165.52,
        "text": "Fester’s on the worktop, Ralf is curled up blue"
      },
      {
        "start": 165.96,
        "end": 169.7,
        "text": "Nic is laughing in the doorway saying, “See, I knew you’d do”"
      },
      {
        "start": 169.96,
        "end": 173.58,
        "text": "If the day says no, I’ll have another go"
      },
      {
        "start": 173.9,
        "end": 178.86,
        "text": "There’s a small light getting brighter and I’m learning where it goes"
      },
      {
        "start": 185.74,
        "end": 189.97,
        "text": "The kettle clicks, the morning comes, the workshop catches fire"
      },
      {
        "start": 190.02,
        "end": 194.13,
        "text": "Not a blaze, just one good idea climbing a little higher"
      },
      {
        "start": 194.18,
        "end": 198.38,
        "text": "I’m still here, still trying, with a spark beneath the skin"
      },
      {
        "start": 199.84,
        "end": 204.58,
        "text": "Skint, Dave from Barnsley—and tonight, I think I win"
      }
    ]
  },
  {
    "id": "penny",
    "title": "Penny, You're Still Here",
    "artist": "Linacre",
    "album": "Proper Mad",
    "genre": "Contemporary Folk-Pop / Heartfelt",
    "duration": "3:58",
    "durationSec": 238,
    "audioFile": "music/tracks/penny.mp3",
    "coverFile": "music/covers/penny.jpg",
    "bpm": "112 BPM",
    "model": "Suno V6-MINI",
    "story": "An uplifting story of overcoming addiction and generational hardship in Barnsley, finding strength through family love for 11-year-old Riley and 2-year-old Tommy.",
    "lyrics": [
      {
        "start": 0,
        "end": 11,
        "text": "Penny grew up where the coal dust stayed,"
      },
      {
        "start": 14.06,
        "end": 16.42,
        "text": "Barnsley rain on the windowpane."
      },
      {
        "start": 18.02,
        "end": 22.85,
        "text": "Jamie was older, trying to stand tall,"
      },
      {
        "start": 22.9,
        "end": 27.48,
        "text": "Chelsea was little, afraid of it all."
      },
      {
        "start": 27.56,
        "end": 31.82,
        "text": "She learned to smile when the cupboard was bare,"
      },
      {
        "start": 32.14,
        "end": 36.5,
        "text": "To hide heavy thoughts beneath brushed hair."
      },
      {
        "start": 37.04,
        "end": 40.9,
        "text": "Some nights the bottle promised relief,"
      },
      {
        "start": 41.14,
        "end": 45.8,
        "text": "Then morning came carrying shame and grief."
      },
      {
        "start": 46.44,
        "end": 50.74,
        "text": "But underneath the hurt, underneath the years,"
      },
      {
        "start": 51.08,
        "end": 55.44,
        "text": "A small brave voice was louder than fear."
      },
      {
        "start": 56.72,
        "end": 58.45,
        "text": "Penny, you're still here, still breathing,"
      },
      {
        "start": 58.5,
        "end": 61.24,
        "text": "Still got a heart that won't stop beating."
      },
      {
        "start": 61.44,
        "end": 63.74,
        "text": "Riley needs your arms, Tommy needs your light,"
      },
      {
        "start": 63.94,
        "end": 65.79,
        "text": "There's a road out of the longest night."
      },
      {
        "start": 65.84,
        "end": 67.82,
        "text": "Step by step, with the past behind,"
      },
      {
        "start": 68.02,
        "end": 71.2,
        "text": "You can leave those chains, you can change your mind."
      },
      {
        "start": 71.4,
        "end": 73.39,
        "text": "Penny, the world can be kind again,"
      },
      {
        "start": 73.44,
        "end": 76.26,
        "text": "This is where your new life begins."
      },
      {
        "start": 84.66,
        "end": 87.8,
        "text": "Eleven-year-old Riley watched her face,"
      },
      {
        "start": 88.8,
        "end": 91.98,
        "text": "Two-year-old Tommy reached for her embrace."
      },
      {
        "start": 92.18,
        "end": 96.84,
        "text": "She saw in their eyes what she couldn't deny,"
      },
      {
        "start": 97.04,
        "end": 101.56,
        "text": "A reason to rise, a reason to try."
      },
      {
        "start": 102.04,
        "end": 105.76,
        "text": "Jamie called round, and Chelsea came too,"
      },
      {
        "start": 105.96,
        "end": 109.86,
        "text": "No grand words, just a hand held true."
      },
      {
        "start": 110.06,
        "end": 115.06,
        "text": "The old days pulled like a river in flood,"
      },
      {
        "start": 115.26,
        "end": 120,
        "text": "But Penny kept choosing the people she loved."
      },
      {
        "start": 120.96,
        "end": 124.68,
        "text": "There were tears on the kitchen floor,"
      },
      {
        "start": 125.34,
        "end": 129.18,
        "text": "But she didn't sleep there anymore."
      },
      {
        "start": 130.36,
        "end": 132.66,
        "text": "Penny, you're still here, still breathing,"
      },
      {
        "start": 132.86,
        "end": 135.1,
        "text": "Still got a heart that won't stop beating."
      },
      {
        "start": 135.3,
        "end": 137.44,
        "text": "Riley needs your arms, Tommy needs your light,"
      },
      {
        "start": 137.64,
        "end": 139.01,
        "text": "There's a road out of the longest night."
      },
      {
        "start": 139.06,
        "end": 141.27,
        "text": "Step by step, with the past behind,"
      },
      {
        "start": 141.32,
        "end": 144.76,
        "text": "You can leave those chains, you can change your mind."
      },
      {
        "start": 144.96,
        "end": 146.61,
        "text": "Penny, the world can be kind again,"
      },
      {
        "start": 146.66,
        "end": 149.32,
        "text": "This is where your new life begins."
      },
      {
        "start": 158.08,
        "end": 161.51,
        "text": "One honest morning, one open door,"
      },
      {
        "start": 161.56,
        "end": 166.54,
        "text": "One promise stronger than before."
      },
      {
        "start": 166.74,
        "end": 171.42,
        "text": "David stood beside her, steady and true,"
      },
      {
        "start": 171.62,
        "end": 175.26,
        "text": "And Penny found the strength to follow through."
      },
      {
        "start": 175.78,
        "end": 179.68,
        "text": "No miracle erased what had been,"
      },
      {
        "start": 181.2,
        "end": 184.72,
        "text": "Just courage to begin again."
      },
      {
        "start": 185.6,
        "end": 187.72,
        "text": "Penny, you're still here, still believing,"
      },
      {
        "start": 187.92,
        "end": 190.4,
        "text": "Still got a heart that won't stop beating."
      },
      {
        "start": 190.6,
        "end": 192.86,
        "text": "Riley's laughing, Tommy's holding tight,"
      },
      {
        "start": 193.06,
        "end": 194.88,
        "text": "The kitchen's full of ordinary light."
      },
      {
        "start": 195.86,
        "end": 197.18,
        "text": "Jamie and Chelsea see her stand,"
      },
      {
        "start": 197.38,
        "end": 199.56,
        "text": "A brighter future built by hand."
      },
      {
        "start": 199.76,
        "end": 203.5,
        "text": "Penny, the world is kind again,"
      },
      {
        "start": 204.32,
        "end": 207.56,
        "text": "This is where your new life begins."
      },
      {
        "start": 209.74,
        "end": 212.88,
        "text": "From Barnsley rain to a clearer sky,"
      },
      {
        "start": 213.08,
        "end": 217.84,
        "text": "She chose tomorrow, she chose to try."
      },
      {
        "start": 218.04,
        "end": 222.08,
        "text": "Penny, keep walking, the worst has passed,"
      },
      {
        "start": 222.28,
        "end": 227.34,
        "text": "A hard-won joy can last."
      }
    ]
  },
  {
    "id": "dave-barnsley",
    "title": "Dave from Barnsley",
    "artist": "Linacre",
    "album": "Proper Mad",
    "genre": "UK Boom-Bap / Comedy Rap",
    "duration": "3:20",
    "durationSec": 200,
    "audioFile": "music/tracks/dave-barnsley.mp3",
    "coverFile": "music/covers/dave-barnsley.jpg",
    "bpm": "94 BPM",
    "model": "Suno V6-MINI",
    "story": "The legendary original UK comedy rap take on Dave, arguing with kettles, dealing with Ramsey Hunt and tinnitus, while cats Fester and Ralf prowl for breakfast.",
    "lyrics": [
      {
        "start": 0,
        "end": 3.08,
        "text": "Yeah, this is Dave from Barnsley"
      },
      {
        "start": 3.7,
        "end": 5.32,
        "text": "Skint, knackered, still standing"
      },
      {
        "start": 6.06,
        "end": 7.85,
        "text": "Nic says, “You’ll get there”"
      },
      {
        "start": 7.9,
        "end": 15.89,
        "text": "The cats say nothing, they just want dinner"
      },
      {
        "start": 15.94,
        "end": 19,
        "text": "Wakes up grumpy, argues with the kettle"
      },
      {
        "start": 19.34,
        "end": 21.4,
        "text": "Bills on the table, nerves on the metal"
      },
      {
        "start": 22.02,
        "end": 23.66,
        "text": "One sock missing, toast burnt black"
      },
      {
        "start": 24.18,
        "end": 26.11,
        "text": "Fester wants breakfast, Ralf wants that"
      },
      {
        "start": 26.16,
        "end": 28.15,
        "text": "Nic says, “Breathe, love, take it slow”"
      },
      {
        "start": 28.2,
        "end": 30.5,
        "text": "Dave says, “I would, but me body says no”"
      },
      {
        "start": 31.48,
        "end": 32.8,
        "text": "Hearing aid squeals like a bus in a tunnel"
      },
      {
        "start": 33.76,
        "end": 35.22,
        "text": "Tinnitus drums on a permanent funnel"
      },
      {
        "start": 35.98,
        "end": 37.62,
        "text": "Ramsey Hunt left him feeling worn and strange"
      },
      {
        "start": 38.24,
        "end": 39.44,
        "text": "Still he checks the post for a life-changing change"
      },
      {
        "start": 41.9,
        "end": 44.95,
        "text": "Oh Dave, Dave, world’s most miserable man"
      },
      {
        "start": 45,
        "end": 47.23,
        "text": "Down on his luck but he’s doing what he can"
      },
      {
        "start": 47.28,
        "end": 49.51,
        "text": "With a head full of plans and a pocket full of lint"
      },
      {
        "start": 49.56,
        "end": 51,
        "text": "He keeps on trying though the battery’s spent"
      },
      {
        "start": 51.96,
        "end": 53.98,
        "text": "Oh Dave, Dave, don’t throw in the towel"
      },
      {
        "start": 54.46,
        "end": 56.49,
        "text": "Fester and Ralf are prowling for chow"
      },
      {
        "start": 56.54,
        "end": 58.93,
        "text": "Nic says, “One more go, you’re closer than you think”"
      },
      {
        "start": 58.98,
        "end": 61.04,
        "text": "He’s got one little spark, and it’s starting to blink"
      },
      {
        "start": 61.7,
        "end": 63.18,
        "text": "Project number one: fix the old machine"
      },
      {
        "start": 63.96,
        "end": 65.76,
        "text": "Project number two: build a better dream"
      },
      {
        "start": 66.3,
        "end": 67.66,
        "text": "Project number three: sell a clever guide"
      },
      {
        "start": 68.54,
        "end": 70.34,
        "text": "Project number four: the wheels fall off inside"
      },
      {
        "start": 71.08,
        "end": 72.82,
        "text": "ADHD brain does a lap of the room"
      },
      {
        "start": 73.16,
        "end": 75.13,
        "text": "Starts with a hammer, ends up painting the loo"
      },
      {
        "start": 75.18,
        "end": 77.66,
        "text": "Exhausted by breakfast, asleep by half ten"
      },
      {
        "start": 78.08,
        "end": 79.82,
        "text": "Wakes up annoyed, then he tries again"
      },
      {
        "start": 80.32,
        "end": 82.69,
        "text": "Back aches, knees creak, shoulder says “Why?”"
      },
      {
        "start": 82.74,
        "end": 84.5,
        "text": "He blames every joint on the weather outside"
      },
      {
        "start": 85.3,
        "end": 87.25,
        "text": "Nic brings tea and gives him the look"
      },
      {
        "start": 87.3,
        "end": 89.26,
        "text": "Fester steals a cable, Ralf eats the book"
      },
      {
        "start": 90.4,
        "end": 91.72,
        "text": "Oh Dave, Dave, world’s most miserable man"
      },
      {
        "start": 92.34,
        "end": 94.31,
        "text": "Down on his luck but he’s doing what he can"
      },
      {
        "start": 94.36,
        "end": 96.61,
        "text": "With a head full of plans and a pocket full of lint"
      },
      {
        "start": 96.66,
        "end": 98.82,
        "text": "He keeps on trying though the battery’s spent"
      },
      {
        "start": 100.22,
        "end": 101.42,
        "text": "Oh Dave, Dave, don’t throw in the towel"
      },
      {
        "start": 101.58,
        "end": 103.24,
        "text": "Fester and Ralf are prowling for chow"
      },
      {
        "start": 103.7,
        "end": 105.89,
        "text": "Nic says, “One more go, you’re closer than you think”"
      },
      {
        "start": 105.94,
        "end": 108.16,
        "text": "He’s got one little spark, and it’s starting to blink"
      },
      {
        "start": 108.7,
        "end": 112.28,
        "text": "Come on, Dave, get up, have another try"
      },
      {
        "start": 113.14,
        "end": 115.15,
        "text": "I’ve got a list, though I’ve lost where I put it"
      },
      {
        "start": 115.2,
        "end": 117.41,
        "text": "A half-built thing and a cat that’s chewed it"
      },
      {
        "start": 117.46,
        "end": 119.81,
        "text": "The world says no, but I’m not done yet"
      },
      {
        "start": 119.86,
        "end": 122.38,
        "text": "I’ve survived worse than a dodgy internet set"
      },
      {
        "start": 122.74,
        "end": 124.85,
        "text": "No grand parade, no miracle plan"
      },
      {
        "start": 124.9,
        "end": 127.33,
        "text": "Just one more step from a stubborn old man"
      },
      {
        "start": 127.38,
        "end": 129.55,
        "text": "If success is a door, I’ll lean on the frame"
      },
      {
        "start": 129.6,
        "end": 131.89,
        "text": "If it won’t open today, I’ll remember the name"
      },
      {
        "start": 131.94,
        "end": 134.29,
        "text": "Then one small customer says, “This works for me”"
      },
      {
        "start": 134.34,
        "end": 136.35,
        "text": "One proper payment, not a maybe or “we’ll see”"
      },
      {
        "start": 136.4,
        "end": 139.03,
        "text": "Dave checks the screen, then checks it again"
      },
      {
        "start": 139.08,
        "end": 141.39,
        "text": "Nic starts laughing, he nearly falls off the chair then"
      },
      {
        "start": 141.44,
        "end": 143.5,
        "text": "Fester looks proud, Ralf knocks over the light"
      },
      {
        "start": 143.98,
        "end": 145.88,
        "text": "The room’s still a mess, but the feeling is right"
      },
      {
        "start": 146.2,
        "end": 148.59,
        "text": "His body still groans and the ringing stays loud"
      },
      {
        "start": 148.64,
        "end": 150.64,
        "text": "But Dave lifts his chin and he’s grinning now"
      },
      {
        "start": 152.04,
        "end": 153.24,
        "text": "From Barnsley gloom to a modest success"
      },
      {
        "start": 153.26,
        "end": 155.1,
        "text": "Not fixed, not rich, but a little less stressed"
      },
      {
        "start": 155.6,
        "end": 157.7,
        "text": "Oh Dave, Dave, world’s most miserable man"
      },
      {
        "start": 158.08,
        "end": 160.27,
        "text": "Down on his luck but he’s doing what he can"
      },
      {
        "start": 160.32,
        "end": 162.59,
        "text": "With a head full of plans and a pocket of grit"
      },
      {
        "start": 162.64,
        "end": 164.85,
        "text": "He kept on moving and he’s landed a hit"
      },
      {
        "start": 164.9,
        "end": 167.45,
        "text": "Oh Dave, Dave, let the whole room know"
      },
      {
        "start": 167.5,
        "end": 169.56,
        "text": "Fester and Ralf, it’s time for the show"
      },
      {
        "start": 170.74,
        "end": 172.03,
        "text": "Nic says, “See? You’re closer than you think”"
      },
      {
        "start": 172.08,
        "end": 174.14,
        "text": "That little spark caught fire, now it’s starting to link"
      },
      {
        "start": 174.6,
        "end": 176.57,
        "text": "Still grumpy, still tired, still losing his pen"
      },
      {
        "start": 176.62,
        "end": 179.15,
        "text": "Still starting new projects at quarter past ten"
      },
      {
        "start": 179.2,
        "end": 181.23,
        "text": "But the kettle is singing, the cats have been fed"
      },
      {
        "start": 181.28,
        "end": 183.72,
        "text": "And Dave’s got a future inside his head"
      },
      {
        "start": 184.12,
        "end": 186,
        "text": "One small win, one stubborn man"
      },
      {
        "start": 186.98,
        "end": 189.54,
        "text": "Barnsley’s finest doing what he can"
      }
    ]
  },
  {
    "id": "crazy-rap",
    "title": "Crazy Rap",
    "artist": "Linacre",
    "album": "Proper Mad",
    "genre": "UK Comedy Rap / Garage Hip-Hop",
    "duration": "2:04",
    "durationSec": 123.96,
    "audioFile": "music/tracks/crazy-rap.mp3",
    "coverFile": "music/covers/crazy-rap.jpg",
    "bpm": "130 BPM",
    "model": "Suno V6-MINI",
    "story": "A high-octane council estate comedy rap filled with puns about mud, Sharon in wellies, Kev doing deals by the bins, and tea in the mug.",
    "lyrics": [
      {
        "start": 0,
        "end": 1.82,
        "text": "Oi, mind the puddle by the stairwell"
      },
      {
        "start": 2.84,
        "end": 4.48,
        "text": "Kettle on, telly loud"
      },
      {
        "start": 4.78,
        "end": 10.28,
        "text": "Woke up to a council letter stuck to the door,"
      },
      {
        "start": 10.32,
        "end": 12.06,
        "text": "Said the rent needs sorting — I’ve heard that before."
      },
      {
        "start": 12.1,
        "end": 13.8,
        "text": "Down by the bins, Kev’s doing deals with a grin,"
      },
      {
        "start": 14.02,
        "end": 15.54,
        "text": "While Sharon in wellies brings the mud right in."
      },
      {
        "start": 15.58,
        "end": 17.4,
        "text": "She’s a proper muck magnet, boots full of clay,"
      },
      {
        "start": 17.44,
        "end": 19.04,
        "text": "Says, “Come on, handsome, let’s get filthy today.”"
      },
      {
        "start": 19.08,
        "end": 20.9,
        "text": "I said, “Love, I’ve got manners, a mop and a plan,”"
      },
      {
        "start": 20.94,
        "end": 22.74,
        "text": "She said, “Forget the mop — be a mucky woman’s man.”"
      },
      {
        "start": 22.78,
        "end": 24.52,
        "text": "Tea in the mug, green in the tin,"
      },
      {
        "start": 24.56,
        "end": 26.32,
        "text": "Neighbours start knocking: “Can we come in?”"
      },
      {
        "start": 26.36,
        "end": 27.9,
        "text": "One little laugh turns the whole block mad,"
      },
      {
        "start": 28.12,
        "end": 29.62,
        "text": "Best worst evening that we’ve ever had."
      },
      {
        "start": 30.16,
        "end": 32.02,
        "text": "Crazy rap from the flats, no lift, just stairs,"
      },
      {
        "start": 32.06,
        "end": 33.49,
        "text": "Mud on the mat and smoke in the airs."
      },
      {
        "start": 34.08,
        "end": 35.38,
        "text": "Mucky woman dancing like she owns the hall,"
      },
      {
        "start": 35.8,
        "end": 37.14,
        "text": "Puns so rude make the plaster fall."
      },
      {
        "start": 37.38,
        "end": 38.58,
        "text": "Crazy rap, let the whole block sing,"
      },
      {
        "start": 39.08,
        "end": 40.24,
        "text": "Council-estate royalty, plastic-gold ring."
      },
      {
        "start": 40.28,
        "end": 42,
        "text": "If life gets grim, we make it slap,"
      },
      {
        "start": 42.04,
        "end": 43.7,
        "text": "Put the kettle on — it’s the crazy rap!"
      },
      {
        "start": 43.74,
        "end": 45.58,
        "text": "She said, “You’re a grass,” I said, “No, I’m a sage,”"
      },
      {
        "start": 45.62,
        "end": 47.28,
        "text": "She said, “That’s not a herb, that’s a landlord’s rage.”"
      },
      {
        "start": 47.32,
        "end": 48.99,
        "text": "Got a spliff in the garden, but the garden’s a tray,"
      },
      {
        "start": 49.32,
        "end": 50.82,
        "text": "Three dead plants and a fox that won’t go away."
      },
      {
        "start": 50.86,
        "end": 52.6,
        "text": "Her coat’s second-hand but her attitude’s new,"
      },
      {
        "start": 52.64,
        "end": 54.4,
        "text": "Got mud on her leggings and a point of view."
      },
      {
        "start": 54.44,
        "end": 56.12,
        "text": "She called me a stud — I said, “That’s a screw,”"
      },
      {
        "start": 56.16,
        "end": 57.88,
        "text": "Now I’m fixing the cupboard while she fixes my mood."
      },
      {
        "start": 57.92,
        "end": 59.64,
        "text": "Bangers in the kitchen, bass through the wall,"
      },
      {
        "start": 59.68,
        "end": 61.54,
        "text": "Someone’s burnt the toast, but we’re blaming the hall."
      },
      {
        "start": 61.58,
        "end": 63.14,
        "text": "The dog’s got my slipper, the cat’s got the cap,"
      },
      {
        "start": 63.34,
        "end": 64.9,
        "text": "Everybody’s skanking to the crazy rap."
      },
      {
        "start": 65.42,
        "end": 67.34,
        "text": "Crazy rap from the flats, no lift, just stairs,"
      },
      {
        "start": 67.38,
        "end": 68.75,
        "text": "Mud on the mat and smoke in the airs."
      },
      {
        "start": 69.32,
        "end": 70.62,
        "text": "Mucky woman dancing like she owns the hall,"
      },
      {
        "start": 71.06,
        "end": 72.42,
        "text": "Puns so rude make the plaster fall."
      },
      {
        "start": 72.46,
        "end": 73.7,
        "text": "Crazy rap, let the whole block sing,"
      },
      {
        "start": 74.52,
        "end": 75.52,
        "text": "Council-estate royalty, plastic-gold ring."
      },
      {
        "start": 75.56,
        "end": 77.26,
        "text": "If life gets grim, we make it slap,"
      },
      {
        "start": 77.3,
        "end": 78.92,
        "text": "Put the kettle on — it’s the crazy rap!"
      },
      {
        "start": 78.96,
        "end": 80.88,
        "text": "She said, “Call me dirty,” I said, “That’s your brand,”"
      },
      {
        "start": 80.92,
        "end": 82.6,
        "text": "She slipped in the puddle and still took my hand."
      },
      {
        "start": 82.64,
        "end": 84.4,
        "text": "We laughed so hard that the neighbours complained,"
      },
      {
        "start": 84.44,
        "end": 86.02,
        "text": "Then borrowed our sugar and came back again."
      },
      {
        "start": 86.06,
        "end": 89.14,
        "text": "No palace, no marble, no chandelier,"
      },
      {
        "start": 89.14,
        "end": 91.56,
        "text": "Just love by the launderette and a bargain-bin beer."
      },
      {
        "start": 95.08,
        "end": 97.24,
        "text": "Crazy rap from the flats, no lift, just stairs,"
      },
      {
        "start": 97.28,
        "end": 99.06,
        "text": "Mud on the mat and smoke in the airs."
      },
      {
        "start": 99.3,
        "end": 100.5,
        "text": "Mucky woman dancing like she owns the hall,"
      },
      {
        "start": 101.1,
        "end": 102.34,
        "text": "Puns so rude make the plaster fall."
      },
      {
        "start": 102.38,
        "end": 103.64,
        "text": "Crazy rap, let the whole block sing,"
      },
      {
        "start": 104.44,
        "end": 105.42,
        "text": "Council-estate royalty, plastic-gold ring."
      },
      {
        "start": 105.46,
        "end": 107.18,
        "text": "If life gets grim, we make it slap,"
      },
      {
        "start": 107.22,
        "end": 109.04,
        "text": "Put the kettle on — it’s the crazy rap!"
      },
      {
        "start": 109.08,
        "end": 110.68,
        "text": "Mind the step, mind the mop,"
      },
      {
        "start": 110.96,
        "end": 112.56,
        "text": "Mind that woman — she don’t stop."
      },
      {
        "start": 112.6,
        "end": 114.3,
        "text": "Green in the tin, tea in the cup,"
      },
      {
        "start": 114.34,
        "end": 115.96,
        "text": "Estate life down, but the chorus up."
      }
    ]
  },
  {
    "id": "statistically",
    "title": "Statistically, We're Fine",
    "artist": "Linacre",
    "album": "Proper Mad",
    "genre": "UK Alternative Comedy Hip-Hop",
    "duration": "2:22",
    "durationSec": 141.8,
    "audioFile": "music/tracks/statistically.mp3",
    "coverFile": "music/covers/statistically.jpg",
    "bpm": "94 BPM",
    "model": "Suno V6-MINI",
    "story": "Dry British deadpan comedy hip-hop about velvet waistcoats, spreadsheets for feelings, emergency stair whistles, and orderly panic.",
    "lyrics": [
      {
        "start": 0.74,
        "end": 1.4,
        "text": "Right—keep it tidy."
      },
      {
        "start": 4.4,
        "end": 5.94,
        "text": "No, actually, don’t."
      },
      {
        "start": 10.52,
        "end": 13.54,
        "text": "I bought a velvet waistcoat from a man called Dave,"
      },
      {
        "start": 13.58,
        "end": 16.18,
        "text": "He said, “It’s nearly vintage,” I said, “Nearly’s brave.”"
      },
      {
        "start": 16.22,
        "end": 18.86,
        "text": "Got a spreadsheet for my feelings, colour-coded in despair,"
      },
      {
        "start": 18.9,
        "end": 20.66,
        "text": "And a tiny little whistle for emergencies involving stairs."
      },
      {
        "start": 21.42,
        "end": 23.92,
        "text": "I’m remarkably composed in a queue for a kebab,"
      },
      {
        "start": 23.96,
        "end": 26.42,
        "text": "Till a pigeon stole my napkin and I called it a cab."
      },
      {
        "start": 26.46,
        "end": 28.9,
        "text": "I’ve got manners like a butler, taste buds like a bin,"
      },
      {
        "start": 28.94,
        "end": 31.56,
        "text": "Put a crown upon a sausage and I’ll probably let it in."
      },
      {
        "start": 31.6,
        "end": 32.34,
        "text": "Hold up—"
      },
      {
        "start": 32.34,
        "end": 33,
        "text": "What was that?"
      },
      {
        "start": 33.36,
        "end": 34.12,
        "text": "No, leave it."
      },
      {
        "start": 34.12,
        "end": 35.98,
        "text": "That’s definitely part of the plan."
      },
      {
        "start": 36.02,
        "end": 38.74,
        "text": "We’re doing fine, we’re doing fine,"
      },
      {
        "start": 38.78,
        "end": 41.22,
        "text": "Absolutely normal, every single time."
      },
      {
        "start": 41.48,
        "end": 43.6,
        "text": "Hands up high if your life’s off-line,"
      },
      {
        "start": 43.64,
        "end": 46.3,
        "text": "We’re doing fine, we’re doing fine."
      },
      {
        "start": 46.86,
        "end": 47.9,
        "text": "Say, “Fine!”"
      },
      {
        "start": 47.9,
        "end": 48.82,
        "text": "(Fine!)"
      },
      {
        "start": 49.46,
        "end": 50.48,
        "text": "Say, “Fine!”"
      },
      {
        "start": 50.48,
        "end": 50.78,
        "text": "(Fine!)"
      },
      {
        "start": 51.58,
        "end": 54.83,
        "text": "That’s the spirit—statistically, we’re fine."
      },
      {
        "start": 55.2,
        "end": 59.02,
        "text": "I rehearsed an apology in case I bump a chair,"
      },
      {
        "start": 59.06,
        "end": 61.5,
        "text": "Then I blamed the architecture with a confident stare."
      },
      {
        "start": 61.7,
        "end": 64.04,
        "text": "My neighbour owns a parrot that has learned to swear,"
      },
      {
        "start": 64.08,
        "end": 67.06,
        "text": "Now it’s more emotionally available than anyone upstairs."
      },
      {
        "start": 67.1,
        "end": 69.8,
        "text": "I made a five-year plan, it lasted till Tuesday,"
      },
      {
        "start": 69.84,
        "end": 72.58,
        "text": "Bought a motivational mug, it said, “Try again someday.”"
      },
      {
        "start": 72.62,
        "end": 74.92,
        "text": "My barber asked for guidance; I said, “Surprise me, mate,”"
      },
      {
        "start": 74.96,
        "end": 77.58,
        "text": "Now I look like a haunted pear that’s running late."
      },
      {
        "start": 77.62,
        "end": 79.02,
        "text": "The bass drops out—"
      },
      {
        "start": 79.02,
        "end": 80,
        "text": "The room gets tense—"
      },
      {
        "start": 80.4,
        "end": 81.19,
        "text": "I’ve got one thought"
      },
      {
        "start": 81.24,
        "end": 82.76,
        "text": "And it’s making no sense."
      },
      {
        "start": 82.8,
        "end": 84.6,
        "text": "I’m fluent in excuses, conversational in cheek,"
      },
      {
        "start": 85.16,
        "end": 86.62,
        "text": "I can turn a minor setback to a documentary critique."
      },
      {
        "start": 87.78,
        "end": 90.3,
        "text": "Got a sandwich in my pocket and a theory in my shoe,"
      },
      {
        "start": 90.34,
        "end": 92.82,
        "text": "If confidence was currency, I’d owe a pound or two."
      },
      {
        "start": 92.86,
        "end": 94.56,
        "text": "You can call me unrealistic; I prefer “future-famous,”"
      },
      {
        "start": 95.46,
        "end": 98.02,
        "text": "I put “enigmatic” on a form that asked for “name and address.”"
      },
      {
        "start": 98.06,
        "end": 100.5,
        "text": "When the punchline lands sideways, let the brass section shout,"
      },
      {
        "start": 100.54,
        "end": 102.32,
        "text": "If you didn’t get the first one, there’s another one—watch out."
      },
      {
        "start": 103.66,
        "end": 106.3,
        "text": "We’re doing fine, we’re doing fine,"
      },
      {
        "start": 106.5,
        "end": 108.92,
        "text": "Absolutely normal, every single time."
      },
      {
        "start": 109.2,
        "end": 111.34,
        "text": "Hands up high if your life’s off-line,"
      },
      {
        "start": 111.38,
        "end": 113.8,
        "text": "We’re doing fine, we’re doing fine."
      },
      {
        "start": 114.26,
        "end": 115.52,
        "text": "Say, “Fine!”"
      },
      {
        "start": 115.52,
        "end": 116.5,
        "text": "(Fine!)"
      },
      {
        "start": 116.5,
        "end": 117.8,
        "text": "Say, “Fine!”"
      },
      {
        "start": 117.8,
        "end": 118.98,
        "text": "(Fine!)"
      },
      {
        "start": 118.98,
        "end": 123,
        "text": "That’s the spirit—statistically, we’re fine."
      },
      {
        "start": 123.8,
        "end": 125.86,
        "text": "No further questions."
      },
      {
        "start": 125.9,
        "end": 129,
        "text": "Please form an orderly panic."
      },
      {
        "start": 129.24,
        "end": 133,
        "text": "We’re doing fine."
      }
    ]
  },
  {
    "id": "your-voice-beside-my-hand",
    "title": "Your Voice Beside My Hand",
    "artist": "Linacre",
    "album": "Proper Mad",
    "genre": "Acoustic Pop-Folk / Contemporary",
    "duration": "3:07",
    "durationSec": 187.16,
    "audioFile": "music/tracks/your-voice-beside-my-hand.mp3",
    "coverFile": "music/covers/your-voice-beside-my-hand.jpg",
    "bpm": "86 BPM",
    "model": "Suno V6-MINI",
    "story": "A warm, intimate acoustic folk-pop ballad about quiet mornings, comfort in presence, and starting again without pressure.",
    "lyrics": [
      {
        "start": 10,
        "end": 13.5,
        "text": "Coffee cooling by the window,"
      },
      {
        "start": 14,
        "end": 17.5,
        "text": "Morning folding into gold."
      },
      {
        "start": 18,
        "end": 20.2,
        "text": "You say, \"Take your time,"
      },
      {
        "start": 20.2,
        "end": 25.18,
        "text": "There's nowhere that we have to be today.\""
      },
      {
        "start": 27.16,
        "end": 31,
        "text": "So we leave the door half-open,"
      },
      {
        "start": 31.64,
        "end": 35.5,
        "text": "Let the quiet fill the space."
      },
      {
        "start": 36.16,
        "end": 39.22,
        "text": "Every little breath feels lighter"
      },
      {
        "start": 39.22,
        "end": 42.7,
        "text": "When I see your smiling face."
      },
      {
        "start": 43.6,
        "end": 46,
        "text": "Come on, sing it with me,"
      },
      {
        "start": 46,
        "end": 48.24,
        "text": "One small note, then two, then three."
      },
      {
        "start": 48.24,
        "end": 50.6,
        "text": "Let the worries lose their way,"
      },
      {
        "start": 50.6,
        "end": 52.48,
        "text": "We can start again today."
      },
      {
        "start": 52.48,
        "end": 54.7,
        "text": "Come on, sing it with me,"
      },
      {
        "start": 54.7,
        "end": 56.98,
        "text": "Low and soft or wild and free."
      },
      {
        "start": 56.98,
        "end": 59.16,
        "text": "Nothing fancy, nothing planned,"
      },
      {
        "start": 59.16,
        "end": 63.5,
        "text": "Just your voice beside my hand."
      },
      {
        "start": 66.56,
        "end": 70,
        "text": "Kettle humming in the kitchen,"
      },
      {
        "start": 70.54,
        "end": 74,
        "text": "Dust is dancing on the shelf."
      },
      {
        "start": 74,
        "end": 78.5,
        "text": "You turn an ordinary Tuesday"
      },
      {
        "start": 78.5,
        "end": 83,
        "text": "Into somewhere I can rest."
      },
      {
        "start": 83,
        "end": 87.3,
        "text": "And the road can wait till later,"
      },
      {
        "start": 87.3,
        "end": 91.18,
        "text": "There is plenty here to hold:"
      },
      {
        "start": 91.18,
        "end": 95.84,
        "text": "A worn-out chair, a folded blanket,"
      },
      {
        "start": 95.84,
        "end": 100,
        "text": "And a story left untold."
      },
      {
        "start": 100,
        "end": 102.72,
        "text": "Come on, sing it with me,"
      },
      {
        "start": 102.72,
        "end": 105,
        "text": "One small note, then two, then three."
      },
      {
        "start": 105,
        "end": 107.34,
        "text": "Let the worries lose their way,"
      },
      {
        "start": 107.34,
        "end": 109.2,
        "text": "We can start again today."
      },
      {
        "start": 109.2,
        "end": 111.46,
        "text": "Come on, sing it with me,"
      },
      {
        "start": 111.46,
        "end": 113.74,
        "text": "Low and soft or wild and free."
      },
      {
        "start": 113.74,
        "end": 115.88,
        "text": "Nothing fancy, nothing planned,"
      },
      {
        "start": 115.88,
        "end": 120.5,
        "text": "Just your voice beside my hand."
      },
      {
        "start": 121.96,
        "end": 126.34,
        "text": "If the day gets loud around us,"
      },
      {
        "start": 126.34,
        "end": 130.34,
        "text": "If the sky forgets to clear,"
      },
      {
        "start": 130.34,
        "end": 135.3,
        "text": "I will leave a place beside me,"
      },
      {
        "start": 135.3,
        "end": 140,
        "text": "You can always meet me here."
      },
      {
        "start": 141.82,
        "end": 144.18,
        "text": "Come on, sing it with me,"
      },
      {
        "start": 144.18,
        "end": 146.52,
        "text": "One small note, then two, then three."
      },
      {
        "start": 146.52,
        "end": 148.76,
        "text": "Let the worries lose their way,"
      },
      {
        "start": 148.76,
        "end": 150.62,
        "text": "We can start again today."
      },
      {
        "start": 150.62,
        "end": 152.9,
        "text": "Come on, sing it with me,"
      },
      {
        "start": 152.9,
        "end": 155.18,
        "text": "Low and soft or wild and free."
      },
      {
        "start": 155.18,
        "end": 157.36,
        "text": "Nothing fancy, nothing planned,"
      },
      {
        "start": 157.36,
        "end": 161.5,
        "text": "Just your voice beside my hand."
      },
      {
        "start": 163,
        "end": 170.5,
        "text": "Just your voice beside my hand,"
      },
      {
        "start": 171.6,
        "end": 179,
        "text": "Take your time, I understand."
      }
    ]
  },
  {
    "id": "nic-on-donny-road",
    "title": "Nic on Donny Road",
    "artist": "Linacre",
    "album": "Proper Mad",
    "genre": "UK Comedy Rap / Northern Boom-Bap",
    "duration": "2:53",
    "durationSec": 173.4,
    "audioFile": "music/tracks/nic-on-donny-road.mp3",
    "coverFile": "music/covers/nic-on-donny-road.jpg",
    "bpm": "98 BPM",
    "model": "Suno V6-MINI",
    "story": "A hilarious, affectionate Northern comedy rap anthem celebrating Nic running the household on Donny Road—sorting out grumpy Dave, feeding cats Fester & Ralf, and keeping the entire show moving with tea and a smile.",
    "lyrics": [
      {
        "start": 0,
        "end": 2.5,
        "text": "Yeah, down on Donny Road,"
      },
      {
        "start": 2.5,
        "end": 4.9,
        "text": "Nic's in charge, keeping the wheels turning."
      },
      {
        "start": 4.9,
        "end": 7.38,
        "text": "Dave's still grumpy, the cats are still hungry,"
      },
      {
        "start": 7.38,
        "end": 12.16,
        "text": "But Nic's running the show on Donny Road."
      },
      {
        "start": 14.92,
        "end": 18,
        "text": "Early morning sunshine on Donny Road,"
      },
      {
        "start": 18,
        "end": 20.98,
        "text": "Nic's on the go, carrying the heavy load."
      },
      {
        "start": 21.3,
        "end": 23.5,
        "text": "Tea in the mug and the keys in her hand,"
      },
      {
        "start": 23.5,
        "end": 25.72,
        "text": "Sorting out the madness, running the land."
      },
      {
        "start": 25.72,
        "end": 28,
        "text": "Dave's in the corner losing his phone,"
      },
      {
        "start": 28,
        "end": 30.52,
        "text": "Fester and Ralf making Donny Road their home."
      },
      {
        "start": 30.66,
        "end": 33,
        "text": "She handles the chaos with a smile and a nod,"
      },
      {
        "start": 33,
        "end": 35.14,
        "text": "Managing the house like an absolute god."
      },
      {
        "start": 35.28,
        "end": 37.8,
        "text": "Postman comes by, drops off the mail,"
      },
      {
        "start": 37.8,
        "end": 40.28,
        "text": "Nic keeps the ship straight, never gonna fail."
      },
      {
        "start": 41.72,
        "end": 44.5,
        "text": "Oh Nic, Nic, legend of Donny Road,"
      },
      {
        "start": 44.5,
        "end": 46.88,
        "text": "Keeping everyone steady, lightens the load."
      },
      {
        "start": 47.04,
        "end": 49,
        "text": "With a heart made of gold and a cup full of tea,"
      },
      {
        "start": 49,
        "end": 51.02,
        "text": "She's the brightest spark on Donny Road, you see."
      },
      {
        "start": 51.02,
        "end": 54,
        "text": "Oh Nic, Nic, holding it all together,"
      },
      {
        "start": 54,
        "end": 57.46,
        "text": "Rain or shine, whatever the weather."
      },
      {
        "start": 57.56,
        "end": 60,
        "text": "She tells old Dave, \"We're doing just fine,\""
      },
      {
        "start": 60,
        "end": 62.44,
        "text": "Nic on Donny Road, shining all the time!"
      },
      {
        "start": 62.44,
        "end": 64.6,
        "text": "Donny Road traffic humming right outside,"
      },
      {
        "start": 64.6,
        "end": 66.82,
        "text": "Nic takes it all in a stride full of pride."
      },
      {
        "start": 66.98,
        "end": 69.3,
        "text": "Fixing up the schedule, planning out the week,"
      },
      {
        "start": 69.3,
        "end": 71.62,
        "text": "Giving Dave the answers before he can speak."
      },
      {
        "start": 71.82,
        "end": 74,
        "text": "Fester wants cuddles, Ralf wants a treat,"
      },
      {
        "start": 74,
        "end": 76.4,
        "text": "Nic moves smooth, never losing a beat."
      },
      {
        "start": 76.4,
        "end": 78.6,
        "text": "From the kitchen counter to the garden gate,"
      },
      {
        "start": 78.6,
        "end": 80.86,
        "text": "She keeps things sweet, never letting things grate."
      },
      {
        "start": 80.86,
        "end": 84.5,
        "text": "A bit of Northern warmth in everything she does,"
      },
      {
        "start": 84.5,
        "end": 88.26,
        "text": "Donny Road's humming with a happy little buzz."
      },
      {
        "start": 88.26,
        "end": 90.8,
        "text": "Oh Nic, Nic, legend of Donny Road,"
      },
      {
        "start": 90.8,
        "end": 93.34,
        "text": "Keeping everyone steady, lightens the load."
      },
      {
        "start": 93.34,
        "end": 95.8,
        "text": "With a heart made of gold and a cup full of tea,"
      },
      {
        "start": 95.8,
        "end": 98.36,
        "text": "She's the brightest spark on Donny Road, you see."
      },
      {
        "start": 98.74,
        "end": 101.4,
        "text": "Oh Nic, Nic, holding it all together,"
      },
      {
        "start": 101.4,
        "end": 104.16,
        "text": "Rain or shine, whatever the weather."
      },
      {
        "start": 104.16,
        "end": 106.8,
        "text": "She tells old Dave, \"We're doing just fine,\""
      },
      {
        "start": 106.8,
        "end": 109.62,
        "text": "Nic on Donny Road, shining all the time!"
      },
      {
        "start": 109.62,
        "end": 111.8,
        "text": "Dave: \"Nic, love, where'd I put me keys?\""
      },
      {
        "start": 111.8,
        "end": 114.3,
        "text": "Nic: \"They're on the hook, Dave, right by your knees!\""
      },
      {
        "start": 114.3,
        "end": 116.6,
        "text": "I keep the place running, keep the cats fed,"
      },
      {
        "start": 116.6,
        "end": 118.96,
        "text": "Make sure there's a roof right over your head."
      },
      {
        "start": 118.96,
        "end": 121.5,
        "text": "Through the daily hassle and the Donny Road noise,"
      },
      {
        "start": 121.5,
        "end": 124.06,
        "text": "I'm keeping my cool and keeping my poise."
      },
      {
        "start": 124.18,
        "end": 126.8,
        "text": "Sun goes down over Donny Road street,"
      },
      {
        "start": 126.8,
        "end": 129.64,
        "text": "Nic sits back, finally off her feet."
      },
      {
        "start": 129.64,
        "end": 132.5,
        "text": "Dave brings a brew, says \"Thanks for the day,\""
      },
      {
        "start": 132.5,
        "end": 135,
        "text": "Cats curl up in their usual way."
      },
      {
        "start": 135,
        "end": 137.28,
        "text": "From morning rush to the evening glow,"
      },
      {
        "start": 137.28,
        "end": 140.5,
        "text": "Nic's the real star of the Donny Road show."
      },
      {
        "start": 140.5,
        "end": 143.5,
        "text": "Yeah, Nic on Donny Road,"
      },
      {
        "start": 143.5,
        "end": 146,
        "text": "Keeping it all together."
      },
      {
        "start": 146,
        "end": 148.32,
        "text": "Dave, Fester, Ralf and Nic,"
      },
      {
        "start": 148.32,
        "end": 151.52,
        "text": "Best team on Donny Road!"
      },
      {
        "start": 151.52,
        "end": 160,
        "text": "That's how we do it!"
      }
    ]
  }
];
