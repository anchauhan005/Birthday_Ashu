/* Personalization lives here. Replace only these values/media paths later. */
const CONFIG = {
  sisterName: 'Ashu',
audio: {
  birthdayMusic: 'assets/audio/birthday.mp3',
  volume: 0.42
},
  surprises: [
  {
    type: 'photo',
    src: 'assets/images/01.jpg',
    message: 'Memory 01 ❤️',
    animation: 'zoom'
  },
  {
    type: 'video',
    src: 'assets/videos/02.mp4',
    poster: 'assets/images/02-poster.jpg',
    message: 'Memory 02 ✨',
    animation: 'slide'
  },

  {
    type: 'photo',
    src: 'assets/images/03.jpg',
    message: 'Memory 03 ❤️',
    animation: 'glow'
  },
  {
    type: 'video',
    src: 'assets/videos/04.mp4',
    poster: '',
    message: 'Memory 04 ✨',
    animation: 'blur'
  },

  {
    type: 'photo',
    src: 'assets/images/05.jpg',
    message: 'Memory 05 ❤️',
    animation: 'tilt'
  },
  {
    type: 'video',
    src: 'assets/videos/06.mp4',
    poster: '',
    message: 'Memory 06 ✨',
    animation: 'scale'
  },

  {
    type: 'photo',
    src: 'assets/images/07.jpg',
    message: 'Memory 07 ❤️',
    animation: 'zoom'
  },
  {
    type: 'video',
    src: 'assets/videos/08.mp4',
    poster: '',
    message: 'Memory 08 ✨',
    animation: 'slide'
  },

  {
    type: 'photo',
    src: 'assets/images/09.jpg',
    message: 'Memory 09 ❤️',
    animation: 'glow'
  },
  {
    type: 'video',
    src: 'assets/videos/10.mp4',
    poster: '',
    message: 'Memory 10 ✨',
    animation: 'emotional'
  }
],
  letter: {
    title: 'For Aastha',
    paragraphs: [
      'Dear Naya Vagarni😑,',
      'Some people enter our lives as strangers, and somehow, without warning, become family. We met in 12th, and somewhere between conversations, silly moments, serious talks and all the little things in between, you became more than just a sister to me — you became one of my closest friends too.',
      'What makes our bond special is that it never needed a perfect definition. We both know what it is. A little brother-sister madness, a little friendship, a little teasing, a lot of understanding — and the kind of comfort that says, “I am on your side,” even before the words are spoken.',
      'You have been there during difficult days, when I needed someone to listen, understand, or simply make things feel a little lighter. I may not always say it properly, but I notice it. I remember it. And I am genuinely grateful for it.',
      'And because I am a computer science guy, I cannot resist writing one tiny piece of code for our bond:',
      `while (life.isRunning()) {\n    sisterAndFriend = forever;\n    support++;\n    memories++;\n    distance = 0;\n}`,
      'No compiler can find an error in a bond built on trust, because some relationships are not written in code — they are written in the heart. ❤️',
      'A little technical shayari for the engineer in me:',
      `“Zindagi ki coding mein tu ek beautiful feature si hai,\nHar tough bug ke baad milne wali relief si hai.\nNa koi 404 wali doori, na koi broken connection,\nTu meri life ki sabse precious, permanent collection.”`,
      'So on your birthday, I do not just wish you a good year. I wish you a year where your dreams compile successfully, your plans run without bugs, your confidence never crashes, and every new chapter gets deployed with happiness, peace and a little extra sparkle.',
      'May you keep becoming the person you dream of becoming. May you laugh loudly, dream fearlessly, and always remember that somewhere in your corner is a brother who will cheer for you, annoy you, defend you, and be proud of you — probably all at the same time. 😄',
      'Happy Birthday, Nanu Bachchu. Thank you for being my sister, my friend, my teammate in this strange little adventure called life. I would not change the story of how we became this close. ❤️',
    ],
    signoff: `With lots of love,\nYour Brother ❤️`
  },
  timings: {
    cakeIntro: 700,
    celebrationWait: 15000,
    letterHold: 850
  }
};

window.CONFIG = CONFIG;
