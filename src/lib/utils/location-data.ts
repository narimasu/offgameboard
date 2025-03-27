// 地域データ（サンプル）
// 実際の実装では全国の都道府県・市区町村情報を設定します
export const prefectures = [
    { id: '01', name: '北海道' },
    { id: '02', name: '青森県' },
    { id: '03', name: '岩手県' },
    { id: '04', name: '宮城県' },
    { id: '05', name: '秋田県' },
    { id: '06', name: '山形県' },
    { id: '07', name: '福島県' },
    { id: '08', name: '茨城県' },
    { id: '09', name: '栃木県' },
    { id: '10', name: '群馬県' },
    { id: '11', name: '埼玉県' },
    { id: '12', name: '千葉県' },
    { id: '13', name: '東京都' },
    { id: '14', name: '神奈川県' },
    { id: '15', name: '新潟県' },
    { id: '16', name: '富山県' },
    { id: '17', name: '石川県' },
    { id: '18', name: '福井県' },
    { id: '19', name: '山梨県' },
    { id: '20', name: '長野県' },
    { id: '21', name: '岐阜県' },
    { id: '22', name: '静岡県' },
    { id: '23', name: '愛知県' },
    { id: '24', name: '三重県' },
    { id: '25', name: '滋賀県' },
    { id: '26', name: '京都府' },
    { id: '27', name: '大阪府' },
    { id: '28', name: '兵庫県' },
    { id: '29', name: '奈良県' },
    { id: '30', name: '和歌山県' },
    { id: '31', name: '鳥取県' },
    { id: '32', name: '島根県' },
    { id: '33', name: '岡山県' },
    { id: '34', name: '広島県' },
    { id: '35', name: '山口県' },
    { id: '36', name: '徳島県' },
    { id: '37', name: '香川県' },
    { id: '38', name: '愛媛県' },
    { id: '39', name: '高知県' },
    { id: '40', name: '福岡県' },
    { id: '41', name: '佐賀県' },
    { id: '42', name: '長崎県' },
    { id: '43', name: '熊本県' },
    { id: '44', name: '大分県' },
    { id: '45', name: '宮崎県' },
    { id: '46', name: '鹿児島県' },
    { id: '47', name: '沖縄県' },
  ];
  
  // 市区町村データ（一部の都道府県のみ）
  export const cities: Record<string, { id: string; name: string }[]> = {
    '13': [ // 東京都
      { id: '13101', name: '千代田区' },
      { id: '13102', name: '中央区' },
      { id: '13103', name: '港区' },
      { id: '13104', name: '新宿区' },
      { id: '13105', name: '文京区' },
      { id: '13106', name: '台東区' },
      { id: '13107', name: '墨田区' },
      { id: '13108', name: '江東区' },
      { id: '13109', name: '品川区' },
      { id: '13110', name: '目黒区' },
      { id: '13111', name: '大田区' },
      { id: '13112', name: '世田谷区' },
      { id: '13113', name: '渋谷区' },
      { id: '13114', name: '中野区' },
      { id: '13115', name: '杉並区' },
      { id: '13116', name: '豊島区' },
      { id: '13117', name: '北区' },
      { id: '13118', name: '荒川区' },
      { id: '13119', name: '板橋区' },
      { id: '13120', name: '練馬区' },
      { id: '13121', name: '足立区' },
      { id: '13122', name: '葛飾区' },
      { id: '13123', name: '江戸川区' },
      { id: '13201', name: '八王子市' },
      { id: '13202', name: '立川市' },
      { id: '13203', name: '武蔵野市' },
      { id: '13204', name: '三鷹市' },
      { id: '13205', name: '青梅市' },
      { id: '13206', name: '府中市' },
      { id: '13207', name: '昭島市' },
      { id: '13208', name: '調布市' },
      { id: '13209', name: '町田市' },
      { id: '13210', name: '小金井市' },
      { id: '13211', name: '小平市' },
      // 他の市区町村...
    ],
    '23': [ // 愛知県
      { id: '23100', name: '名古屋市' },
      { id: '23201', name: '豊橋市' },
      { id: '23202', name: '岡崎市' },
      { id: '23203', name: '一宮市' },
      { id: '23204', name: '瀬戸市' },
      { id: '23205', name: '半田市' },
      { id: '23206', name: '春日井市' },
      { id: '23207', name: '豊川市' },
      { id: '23208', name: '津島市' },
      { id: '23209', name: '碧南市' },
      { id: '23210', name: '刈谷市' },
      { id: '23211', name: '豊田市' },
      { id: '23212', name: '安城市' },
      { id: '23213', name: '西尾市' },
      { id: '23214', name: '蒲郡市' },
      { id: '23215', name: '犬山市' },
      { id: '23216', name: '常滑市' },
      { id: '23217', name: '江南市' },
      { id: '23219', name: '小牧市' },
      { id: '23220', name: '稲沢市' },
      { id: '23221', name: '新城市' },
      { id: '23222', name: '東海市' },
      { id: '23223', name: '大府市' },
      { id: '23224', name: '知多市' },
      { id: '23225', name: '知立市' },
      { id: '23226', name: '尾張旭市' },
      { id: '23227', name: '高浜市' },
      { id: '23228', name: '岩倉市' },
      { id: '23229', name: '豊明市' },
      { id: '23230', name: '日進市' },
      { id: '23231', name: '田原市' },
      { id: '23232', name: '愛西市' },
      { id: '23233', name: '清須市' },
      { id: '23234', name: '北名古屋市' },
      { id: '23235', name: '弥富市' },
      { id: '23236', name: 'みよし市' },
      { id: '23237', name: 'あま市' },
      { id: '23238', name: '長久手市' },
    ],
    '27': [ // 大阪府
      { id: '27100', name: '大阪市' },
      { id: '27140', name: '堺市' },
      { id: '27201', name: '岸和田市' },
      { id: '27202', name: '豊中市' },
      { id: '27203', name: '池田市' },
      { id: '27204', name: '吹田市' },
      { id: '27205', name: '泉大津市' },
      { id: '27206', name: '高槻市' },
      { id: '27207', name: '貝塚市' },
      { id: '27208', name: '守口市' },
      { id: '27209', name: '枚方市' },
      { id: '27210', name: '茨木市' },
      { id: '27211', name: '八尾市' },
      { id: '27212', name: '泉佐野市' },
      { id: '27213', name: '富田林市' },
      { id: '27214', name: '寝屋川市' },
      { id: '27215', name: '河内長野市' },
      { id: '27216', name: '松原市' },
      { id: '27217', name: '大東市' },
      { id: '27218', name: '和泉市' },
      { id: '27219', name: '箕面市' },
      { id: '27220', name: '柏原市' },
      { id: '27221', name: '羽曳野市' },
      { id: '27222', name: '門真市' },
      { id: '27223', name: '摂津市' },
      { id: '27224', name: '高石市' },
      { id: '27225', name: '藤井寺市' },
      { id: '27226', name: '東大阪市' },
      { id: '27227', name: '泉南市' },
      { id: '27228', name: '四條畷市' },
      { id: '27229', name: '交野市' },
      { id: '27230', name: '大阪狭山市' },
      { id: '27231', name: '阪南市' },
    ],
  };
  
  // 路線データ
  export const railways = [
    { id: '1', name: 'JR東海道本線' },
    { id: '2', name: 'JR中央線' },
    { id: '3', name: '名古屋市営地下鉄東山線' },
    { id: '4', name: '名古屋市営地下鉄名城線' },
    { id: '5', name: 'JR山手線' },
    { id: '6', name: '東京メトロ銀座線' },
    { id: '7', name: '東京メトロ丸ノ内線' },
    { id: '8', name: '大阪メトロ御堂筋線' },
    { id: '9', name: 'JR大阪環状線' },
    { id: '10', name: 'JR中央・総武線' },
    { id: '11', name: '東急田園都市線' },
    { id: '12', name: '小田急小田原線' },
  ];
  
  // 駅データ
  export const stations: Record<string, { id: string; name: string }[]> = {
    '1': [ // JR東海道本線
      { id: '1001', name: '東京' },
      { id: '1002', name: '品川' },
      { id: '1003', name: '横浜' },
      { id: '1004', name: '小田原' },
      { id: '1005', name: '熱海' },
      { id: '1006', name: '静岡' },
      { id: '1007', name: '浜松' },
      { id: '1008', name: '豊橋' },
      { id: '1009', name: '名古屋' },
      { id: '1010', name: '岐阜' },
      { id: '1011', name: '大垣' },
      { id: '1012', name: '米原' },
      { id: '1013', name: '京都' },
      { id: '1014', name: '大阪' },
      { id: '1015', name: '神戸' },
    ],
    '3': [ // 名古屋市営地下鉄東山線
      { id: '3001', name: '藤が丘' },
      { id: '3002', name: '本郷' },
      { id: '3003', name: '名古屋大学' },
      { id: '3004', name: '八事' },
      { id: '3005', name: '本山' },
      { id: '3006', name: '池下' },
      { id: '3007', name: '今池' },
      { id: '3008', name: '千種' },
      { id: '3009', name: '覚王山' },
      { id: '3010', name: '新栄町' },
      { id: '3011', name: '栄' },
      { id: '3012', name: '伏見' },
      { id: '3013', name: '丸の内' },
      { id: '3014', name: '久屋大通' },
      { id: '3015', name: '高岳' },
      { id: '3016', name: '車道' },
      { id: '3017', name: '東山公園' },
      { id: '3018', name: '星ヶ丘' },
      { id: '3019', name: '一社' },
      { id: '3020', name: '上社' },
    ],
    '5': [ // JR山手線
      { id: '5001', name: '東京' },
      { id: '5002', name: '神田' },
      { id: '5003', name: '秋葉原' },
      { id: '5004', name: '御徒町' },
      { id: '5005', name: '上野' },
      { id: '5006', name: '鶯谷' },
      { id: '5007', name: '日暮里' },
      { id: '5008', name: '西日暮里' },
      { id: '5009', name: '田端' },
      { id: '5010', name: '駒込' },
      { id: '5011', name: '巣鴨' },
      { id: '5012', name: '大塚' },
      { id: '5013', name: '池袋' },
      { id: '5014', name: '目白' },
      { id: '5015', name: '高田馬場' },
      { id: '5016', name: '新大久保' },
      { id: '5017', name: '新宿' },
      { id: '5018', name: '代々木' },
      { id: '5019', name: '原宿' },
      { id: '5020', name: '渋谷' },
      { id: '5021', name: '恵比寿' },
      { id: '5022', name: '目黒' },
      { id: '5023', name: '五反田' },
      { id: '5024', name: '大崎' },
      { id: '5025', name: '品川' },
      { id: '5026', name: '田町' },
      { id: '5027', name: '浜松町' },
      { id: '5028', name: '新橋' },
      { id: '5029', name: '有楽町' },
    ],
    '8': [ // 大阪メトロ御堂筋線
      { id: '8001', name: '江坂' },
      { id: '8002', name: '東三国' },
      { id: '8003', name: '新大阪' },
      { id: '8004', name: '西中島南方' },
      { id: '8005', name: '中津' },
      { id: '8006', name: '梅田' },
      { id: '8007', name: '淀屋橋' },
      { id: '8008', name: '本町' },
      { id: '8009', name: '心斎橋' },
      { id: '8010', name: '難波' },
      { id: '8011', name: '大国町' },
      { id: '8012', name: '動物園前' },
      { id: '8013', name: '天王寺' },
      { id: '8014', name: '昭和町' },
      { id: '8015', name: '西田辺' },
      { id: '8016', name: '長居' },
      { id: '8017', name: 'あびこ' },
      { id: '8018', name: '北花田' },
      { id: '8019', name: '新金岡' },
      { id: '8020', name: 'なかもず' },
    ],
  };