/**
 * Database Kartu Ilustrasi (Biru) & Kartu Edukasi (Kuning) SWARA
 * Berdasarkan dokumen kurikulum & kartu edukasi resmi SWARA.
 */

export const CARDS_DATA = [
  {
    id: 1,
    category: "Pelanggaran Batasan & Manipulasi Rahasia",
    frontImage: "/assets/cards/page_01.png",
    backImage: "/assets/cards/page_11.png",
    title: "Rahasia yang Mencurigakan",
    question: "Seseorang menyuruhmu merahasiakan suatu hal yang membuatmu merasa takut, bingung, atau tidak nyaman. Apa yang sebaiknya kamu lakukan?",
    options: [
      { id: "A", text: "Menyimpannya rapat-rapat karena sudah terlanjur berjanji.", isCorrect: false },
      { id: "B", text: "Katakan tegas: 'Aku tidak mau merahasiakan ini', lalu ceritakan ke orang tua/guru.", isCorrect: true },
      { id: "C", text: "Diam saja dan berusaha melupakannya sendirian.", isCorrect: false }
    ],
    explanationTitle: "Waspada Rahasia yang Tidak Sepantasnya",
    explanationText: "Kamu TIDAK PERLU menyimpan rahasia yang membuatmu takut, bingung, atau tidak nyaman. Katakan: 'Aku tidak mau merahasiakan ini.' Lalu ceritakan kepada orang tua, guru, atau orang dewasa yang dipercaya.",
    stars: 4
  },
  {
    id: 2,
    category: "Pelecehan Verbal & Komentar Fisik",
    frontImage: "/assets/cards/page_02.png",
    backImage: "/assets/cards/page_12.png",
    title: "Komentar Fisik / Body Shaming",
    question: "Seseorang mengejek atau mengomentari fisikmu: 'Kamu kok kurus banget sih? Jelek deh!' Bagaimana respon terbaikmu?",
    options: [
      { id: "A", text: "Merasa rendah diri dan membiarkannya mengejekmu terus.", isCorrect: false },
      { id: "B", text: "Katakan tegas: 'Tolong jangan komentari tubuh saya', lalu menjauh.", isCorrect: true },
      { id: "C", text: "Membalas dengan memukul atau mengejek kembali.", isCorrect: false }
    ],
    explanationTitle: "Hak Atas Rasa Hormat Terhadap Tubuh",
    explanationText: "Jika dikomentari tentang fisik (kurus, jelek, dll), kamu berhak merasa tidak nyaman dan mengatakan: 'Tolong jangan komentari tubuh saya.' Menjauhlah dan ceritakan kepada orang dewasa terpercaya jika terus berulang.",
    stars: 4
  },
  {
    id: 3,
    category: "Sentuhan Tidak Aman (Kekerasan Fisik)",
    frontImage: "/assets/cards/page_03.png",
    backImage: "/assets/cards/page_13.png",
    title: "Dicubit Kencang & Disengaja",
    question: "Seseorang mencubit pipimu dengan kencang secara sengaja hingga terasa sakit dan kamu tidak suka. Apa tindakanmu?",
    options: [
      { id: "A", text: "Katakan dengan tegas: 'Jangan cubit saya, saya tidak suka!' lalu segera menjauh.", isCorrect: true },
      { id: "B", text: "Hanya tersenyum pura-pura tidak sakit agar dianggap ramah.", isCorrect: false },
      { id: "C", text: "Membiarkannya karena yang mencubit adalah orang yang lebih tua.", isCorrect: false }
    ],
    explanationTitle: "Menolak Sentuhan yang Menyakitkan",
    explanationText: "Jika dicubit pipinya dengan kencang dan sengaja, katakan dengan tegas: 'Jangan cubit saya, saya tidak suka.' Segera menjauh dan laporkan jika tindakan tersebut dilakukan sengaja atau berulang.",
    stars: 4
  },
  {
    id: 4,
    category: "Pelanggaran Batasan & Konsen Tubuh",
    frontImage: "/assets/cards/page_04.png",
    backImage: "/assets/cards/page_14.png",
    title: "Dipeluk Tanpa Meminta Izin",
    question: "Seseorang (meskipun orang yang kamu kenal) tiba-tiba memelukmu tanpa meminta izin dan kamu merasa tidak nyaman. Apa yang harus kamu lakukan?",
    options: [
      { id: "A", text: "Terpaksa menerima karena takut dia tersinggung.", isCorrect: false },
      { id: "B", text: "Berhak menolak pelukan: 'Saya tidak mau dipeluk', lalu mundur/menjauh.", isCorrect: true },
      { id: "C", text: "Membiarkannya setiap kali bertemu.", isCorrect: false }
    ],
    explanationTitle: "Hak Menolak Sentuhan & Pelukan",
    explanationText: "Kamu berhak menolak pelukan, meskipun yang memeluk adalah orang yang kamu kenal. Katakan: 'Saya tidak mau dipeluk.' Mundur atau menjauh jika merasa tidak nyaman.",
    stars: 4
  },
  {
    id: 5,
    category: "Sentuhan Aman (Etika & Batasan)",
    frontImage: "/assets/cards/page_05.png",
    backImage: "/assets/cards/page_15.png",
    title: "Berjabat Tangan Wajar",
    question: "Seseorang mengajakmu berjabat tangan saat berkenalan secara sopan. Apakah situasi ini sentuhan aman, dan bagaimana hakmu?",
    options: [
      { id: "A", text: "Sentuhan aman wajar, namun kamu tetap punya hak menolak jika tidak ingin disentuh.", isCorrect: true },
      { id: "B", text: "Sentuhan terlarang dan harus selalu dilaporkan ke polisi.", isCorrect: false },
      { id: "C", text: "Wajib menerima jabat tangan siapapun tanpa boleh menolak sama sekali.", isCorrect: false }
    ],
    explanationTitle: "Berjabat Tangan & Hak Menolak",
    explanationText: "Berjabat tangan adalah sentuhan aman dan wajar sesuai situasi. Namun, anak TETAP BERHAK MENOLAK jika tidak ingin disentuh, misalnya dengan berkata: 'Maaf, saya tidak mau berjabat tangan.'",
    stars: 4
  },
  {
    id: 6,
    category: "Sentuhan Aman (Kasih Sayang Wajar)",
    frontImage: "/assets/cards/page_06.png",
    backImage: "/assets/cards/page_16.png",
    title: "Dielus Kepalanya",
    question: "Orang terdekat (guru/keluarga) mengelus kepalamu sebagai bentuk apresiasi wajar. Bagaimana kamu menyikapinya?",
    options: [
      { id: "A", text: "Sentuhan wajar jika kamu nyaman, tapi kamu tetap berhak berkata tidak jika tidak suka.", isCorrect: true },
      { id: "B", text: "Pasti pelecehan dan harus langsung berteriak minta tolong.", isCorrect: false },
      { id: "C", text: "Harus selalu diam saja walaupun kamu merasa risih.", isCorrect: false }
    ],
    explanationTitle: "Sentuhan Kasih Sayang & Batasan Diri",
    explanationText: "Dielus kepalanya jika dilakukan dengan wajar dan anak merasa nyaman bukanlah tindakan yang salah. Namun, anak tetap punya hak menolak sentuhan. Katakan: 'Tolong jangan elus kepala saya.'",
    stars: 4
  },
  {
    id: 7,
    category: "Pelecehan Visual & Konten Terlarang",
    frontImage: "/assets/cards/page_07.png",
    backImage: "/assets/cards/page_17.png",
    title: "Ditunjukkan Foto/Video Tidak Senonoh",
    question: "Seseorang menunjukkan foto atau video tidak senonoh / pornografi kepadamu melalui ponselnya. Apa langkah yang benar?",
    options: [
      { id: "A", text: "Menontonnya bersama dan meneruskannya ke teman lain.", isCorrect: false },
      { id: "B", text: "Tolak segera, tutup tayangan, menjauh, dan beri tahu orang tua atau guru.", isCorrect: true },
      { id: "C", text: "Menyimpan foto tersebut di ponselmu sendiri.", isCorrect: false }
    ],
    explanationTitle: "Tolak dan Laporkan Konten Tidak Pantas",
    explanationText: "Kamu harus segera menolak dan melaporkan! Jangan meneruskan atau menyebarkan video tersebut. Tutup/tinggalkan tayangan, menjauh, dan beritahu orang dewasa terpercaya. Kamu tidak bersalah karena diperlihatkan hal tersebut.",
    stars: 4
  },
  {
    id: 8,
    category: "Pelanggaran Batasan Pribadi",
    frontImage: "/assets/cards/page_08.png",
    backImage: "/assets/cards/page_18.png",
    title: "Dirangkul Tiba-Tiba",
    question: "Seseorang merangkul pundakmu secara tiba-tiba tanpa persetujuan dan membuatmu merasa risih/takut. Apa tindakanmu?",
    options: [
      { id: "A", text: "Katakan: 'Jangan rangkul saya', segera menjauh dan laporkan jika berulang.", isCorrect: true },
      { id: "B", text: "Diam saja karena menganggap itu hal yang biasa.", isCorrect: false },
      { id: "C", text: "Menyalahkan diri sendiri karena berada di dekat orang tersebut.", isCorrect: false }
    ],
    explanationTitle: "Tegas Terhadap Rangkulan Tanpa Izin",
    explanationText: "Jika dirangkul tiba-tiba dan merasa tidak nyaman, kamu boleh berkata: 'Jangan rangkul saya.' Segera menjauh. Jika terjadi berulang atau membuat takut, ceritakan kepada orang dewasa terpercaya.",
    stars: 4
  },
  {
    id: 9,
    category: "Interaksi Sosial Aman (Kewaspadaan Diri)",
    frontImage: "/assets/cards/page_09.png",
    backImage: "/assets/cards/page_19.png",
    title: "Mengobrol dengan Jarak Wajar",
    question: "Kamu sedang mengobrol biasa dengan seseorang di tempat terbuka dengan jarak yang wajar. Bagaimana penilaian situasinya?",
    options: [
      { id: "A", text: "Interaksi aman wajar, namun tetap waspada jika obrolan mengarah ke hal tidak pantas.", isCorrect: true },
      { id: "B", text: "Situasi sangat berbahaya dan tidak boleh berbicara dengan siapapun.", isCorrect: false },
      { id: "C", text: "Pasti aman 100% sehingga boleh membocorkan rahasia pribadi apapun.", isCorrect: false }
    ],
    explanationTitle: "Interaksi Wajar & Kepekaan Diri",
    explanationText: "Mengobrol dengan jarak yang wajar adalah interaksi aman. Kamu tetap perlu waspada jika pembicaraan berubah menjadi hal yang tidak pantas, membuat tidak nyaman, atau meminta rahasia. Kamu berhak pergi jika merasa tidak nyaman.",
    stars: 4
  },
  {
    id: 10,
    category: "Penyalahgunaan Otoritas & Perintah Terlarang",
    frontImage: "/assets/cards/page_10.png",
    backImage: "/assets/cards/page_20.png",
    title: "Perintah Melanggar Batas Tubuh",
    question: "Seseorang yang lebih tua memerintahkanmu melakukan sesuatu yang melanggar batas tubuh atau privasimu secara rahasia. Apa tindakanmu?",
    options: [
      { id: "A", text: "Selalu menuruti karena orang yang lebih tua selalu benar.", isCorrect: false },
      { id: "B", text: "Katakan 'TIDAK', segera menjauh, dan cari bantuan orang dewasa terpercaya.", isCorrect: true },
      { id: "C", text: "Mengikuti perintahnya asalkan diberi hadiah atau uang jajan.", isCorrect: false }
    ],
    explanationTitle: "Berani Berkata 'TIDAK' pada Perintah yang Salah",
    explanationText: "Tidak semua perintah orang yang lebih tua boleh dituruti jika melanggar batas tubuh, bersifat rahasia, atau tidak pantas. Kamu berhak berkata 'TIDAK', menjauh, dan segera mencari bantuan.",
    stars: 4
  }
];

export class CardDeck {
  constructor(cards = CARDS_DATA) {
    this.allCards = [...cards];
    this.deck = this.shuffle([...this.allCards]);
    this.discardPile = [];
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  drawCard() {
    if (this.deck.length === 0) {
      if (this.discardPile.length === 0) return null;
      this.deck = this.shuffle([...this.discardPile]);
      this.discardPile = [];
    }
    const card = this.deck.pop();
    this.discardPile.push(card);
    return card;
  }

  get remainingCount() {
    return this.deck.length;
  }

  get totalCards() {
    return this.allCards.length;
  }

  reset() {
    this.deck = this.shuffle([...this.allCards]);
    this.discardPile = [];
  }
}
