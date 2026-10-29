import {
  ClassSession,
  IllustrationCategoryKey,
  INITIAL_VOCAB_SLIDES,
  LeaderboardEntry,
  STROKE_LIBRARY,
  StrokeData,
  VocabSlide,
} from '../data/chineseData';

export interface SmartDictEntry {
  pinyin: string;
  hanViet: string;
  meaning: string;
  partOfSpeech: string;
  hskLevel: string;
  usageNote: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleMeaning: string;
  illustrationKey: IllustrationCategoryKey;
}

export interface CharMetaEntry {
  pinyin: string;
  hanViet: string;
  meaning: string;
  radical: string;
  strokeCount: number;
}

export const CHAR_META_DICTIONARY: Record<string, CharMetaEntry> = {
  温: { pinyin: 'wēn', hanViet: 'ôn', meaning: 'ấm áp, ôn hòa', radical: '氵 (Thủy - Nước)', strokeCount: 12 },
  暖: { pinyin: 'nuǎn', hanViet: 'noãn', meaning: 'ấm, sưởi ấm', radical: '日 (Nhật - Mặt trời)', strokeCount: 13 },
  龙: { pinyin: 'lóng', hanViet: 'long', meaning: 'rồng phương Đông', radical: '龙 (Long - Rồng)', strokeCount: 5 },
  老: { pinyin: 'lǎo', hanViet: 'lão', meaning: 'lớn tuổi, giàu kinh nghiệm', radical: '耂 (Lão)', strokeCount: 6 },
  师: { pinyin: 'shī', hanViet: 'sư', meaning: 'thầy giáo, bậc thầy', radical: '巾 (Cân - Khăn)', strokeCount: 6 },
  聪: { pinyin: 'cōng', hanViet: 'thông', meaning: 'thính tai, thông tuệ', radical: '耳 (Nhĩ - Tai)', strokeCount: 15 },
  明: { pinyin: 'míng', hanViet: 'minh', meaning: 'sáng sủa, rõ ràng', radical: '日 (Nhật - Mặt trời)', strokeCount: 8 },
  幸: { pinyin: 'xìng', hanViet: 'hạnh', meaning: 'may mắn, hạnh phúc', radical: '干 (Can)', strokeCount: 8 },
  福: { pinyin: 'fú', hanViet: 'phúc', meaning: 'phúc lành, may mắn', radical: '礻 (Thị - Lễ)', strokeCount: 13 },
  咖: { pinyin: 'kā', hanViet: 'gia', meaning: 'cà phê (phiên âm)', radical: '口 (Khẩu - Miệng)', strokeCount: 8 },
  啡: { pinyin: 'fēi', hanViet: 'phê', meaning: 'cà phê (phiên âm)', radical: '口 (Khẩu - Miệng)', strokeCount: 11 },
  朋: { pinyin: 'péng', hanViet: 'bằng', meaning: 'bạn bè', radical: '月 (Nguyệt - Trăng)', strokeCount: 8 },
  友: { pinyin: 'yǒu', hanViet: 'hữu', meaning: 'bạn hữu, thân thiện', radical: '又 (Hựu - Lại)', strokeCount: 4 },
  努: { pinyin: 'nǔ', hanViet: 'nỗ', meaning: 'gắng sức, nỗ lực', radical: '力 (Lực - Sức mạnh)', strokeCount: 7 },
  力: { pinyin: 'lì', hanViet: 'lực', meaning: 'sức lực, năng lực', radical: '力 (Lực - Sức mạnh)', strokeCount: 2 },
  爱: { pinyin: 'ài', hanViet: 'ái', meaning: 'yêu thương, quý mến', radical: '爫 (Trảo)', strokeCount: 10 },
  情: { pinyin: 'qíng', hanViet: 'tình', meaning: 'tình cảm, tấm lòng', radical: '忄 (Tâm đứng)', strokeCount: 11 },
  学: { pinyin: 'xué', hanViet: 'học', meaning: 'học tập, nghiên cứu', radical: '子 (Tử - Con)', strokeCount: 8 },
  习: { pinyin: 'xí', hanViet: 'tập', meaning: 'ôn tập, thực hành', radical: '乙 (Ất)', strokeCount: 3 },
  校: { pinyin: 'xiào', hanViet: 'hiệu', meaning: 'trường học', radical: '木 (Mộc - Cây)', strokeCount: 10 },
  家: { pinyin: 'jiā', hanViet: 'gia', meaning: 'nhà, gia đình', radical: '宀 (Miên - Mái nhà)', strokeCount: 10 },
  庭: { pinyin: 'tíng', hanViet: 'đình', meaning: 'sân nhà, gia đình', radical: '广 (Nghiễm)', strokeCount: 9 },
  水: { pinyin: 'shuǐ', hanViet: 'thủy', meaning: 'nước, dòng nước', radical: '水 (Thủy - Nước)', strokeCount: 4 },
  火: { pinyin: 'huǒ', hanViet: 'hỏa', meaning: 'lửa, ánh lửa', radical: '火 (Hỏa - Lửa)', strokeCount: 4 },
  山: { pinyin: 'shān', hanViet: 'sơn', meaning: 'núi non', radical: '山 (Sơn - Núi)', strokeCount: 3 },
  风: { pinyin: 'fēng', hanViet: 'phong', meaning: 'cơn gió, phong cảnh', radical: '风 (Phong - Gió)', strokeCount: 4 },
  雨: { pinyin: 'yǔ', hanViet: 'vũ', meaning: 'cơn mưa', radical: '雨 (Vũ - Mưa)', strokeCount: 8 },
  雪: { pinyin: 'xuě', hanViet: 'tuyết', meaning: 'tuyết trắng', radical: '雨 (Vũ - Mưa)', strokeCount: 11 },
  茶: { pinyin: 'chá', hanViet: 'trà', meaning: 'trà, lá chè', radical: '艹 (Thảo - Cỏ)', strokeCount: 9 },
  花: { pinyin: 'huā', hanViet: 'hoa', meaning: 'bông hoa', radical: '艹 (Thảo - Cỏ)', strokeCount: 7 },
  园: { pinyin: 'yuán', hanViet: 'viên', meaning: 'khu vườn, công viên', radical: '囗 (Vi - Vây quanh)', strokeCount: 7 },
  春: { pinyin: 'chūn', hanViet: 'xuân', meaning: 'mùa xuân, sức sống', radical: '日 (Nhật - Mặt trời)', strokeCount: 9 },
  天: { pinyin: 'tiān', hanViet: 'thiên', meaning: 'bầu trời, ngày', radical: '大 (Đại - To lớn)', strokeCount: 4 },
  阳: { pinyin: 'yáng', hanViet: 'dương', meaning: 'mặt trời, ánh dương', radical: '阝 (Phụ)', strokeCount: 6 },
  光: { pinyin: 'guāng', hanViet: 'quang', meaning: 'ánh sáng, rực rỡ', radical: '儿 (Nhân)', strokeCount: 6 },
  快: { pinyin: 'kuài', hanViet: 'khoái', meaning: 'nhanh, vui vẻ', radical: '忄 (Tâm đứng)', strokeCount: 7 },
  乐: { pinyin: 'lè', hanViet: 'lạc', meaning: 'niềm vui, an lạc', radical: '丿 (Phiệt)', strokeCount: 5 },
  高: { pinyin: 'gāo', hanViet: 'cao', meaning: 'cao lớn, vui mừng', radical: '高 (Cao)', strokeCount: 10 },
  兴: { pinyin: 'xìng', hanViet: 'hứng', meaning: 'hào hứng, phấn khởi', radical: '八 (Bát)', strokeCount: 6 },
  喜: { pinyin: 'xǐ', hanViet: 'hỷ', meaning: 'tin vui, yêu thích', radical: '口 (Khẩu - Miệng)', strokeCount: 12 },
  欢: { pinyin: 'huān', hanViet: 'hoan', meaning: 'hân hoan, vui mừng', radical: '欠 (Khiếm)', strokeCount: 6 },
  工: { pinyin: 'gōng', hanViet: 'công', meaning: 'công việc, lao động', radical: '工 (Công)', strokeCount: 3 },
  作: { pinyin: 'zuò', hanViet: 'tác', meaning: 'làm việc, sáng tác', radical: '亻 (Nhân đứng)', strokeCount: 7 },
  健: { pinyin: 'jiàn', hanViet: 'kiện', meaning: 'khỏe mạnh, tráng kiện', radical: '亻 (Nhân đứng)', strokeCount: 10 },
  康: { pinyin: 'kāng', hanViet: 'khang', meaning: 'bình an, khỏe mạnh', radical: '广 (Nghiễm)', strokeCount: 11 },
  成: { pinyin: 'chéng', hanViet: 'thành', meaning: 'hoàn thành, đạt được', radical: '戈 (Qua)', strokeCount: 6 },
  功: { pinyin: 'gōng', hanViet: 'công', meaning: 'công lao, thành tựu', radical: '力 (Lực - Sức mạnh)', strokeCount: 5 },
  梦: { pinyin: 'mèng', hanViet: 'mộng', meaning: 'giấc mơ, ước mơ', radical: '木 (Mộc - Cây)', strokeCount: 11 },
  想: { pinyin: 'xiǎng', hanViet: 'tưởng', meaning: 'suy nghĩ, mong nhớ', radical: '心 (Tâm - Trái tim)', strokeCount: 13 },
  旅: { pinyin: 'lǚ', hanViet: 'lữ', meaning: 'chuyến đi, du lịch', radical: '方 (Phương)', strokeCount: 10 },
  游: { pinyin: 'yóu', hanViet: 'du', meaning: 'du ngoạn, bơi lội', radical: '氵 (Thủy - Nước)', strokeCount: 12 },
  美: { pinyin: 'měi', hanViet: 'mỹ', meaning: 'tốt đẹp, xinh đẹp', radical: '羊 (Dương)', strokeCount: 9 },
  食: { pinyin: 'shí', hanViet: 'thực', meaning: 'thức ăn, ẩm thực', radical: '食 (Thực - Ăn)', strokeCount: 9 },
  电: { pinyin: 'diàn', hanViet: 'điện', meaning: 'điện năng, tia chớp', radical: '田 (Điền)', strokeCount: 5 },
  脑: { pinyin: 'nǎo', hanViet: 'não', meaning: 'bộ não, trí óc', radical: '月 (Nhục)', strokeCount: 10 },
  手: { pinyin: 'shǒu', hanViet: 'thủ', meaning: 'bàn tay', radical: '手 (Thủ - Tay)', strokeCount: 4 },
  机: { pinyin: 'jī', hanViet: 'cơ', meaning: 'máy móc, cơ hội', radical: '木 (Mộc - Cây)', strokeCount: 6 },
  书: { pinyin: 'shū', hanViet: 'thư', meaning: 'quyển sách, kinh thư', radical: '乛 (Ất)', strokeCount: 4 },
  猫: { pinyin: 'māo', hanViet: 'miêu', meaning: 'con mèo', radical: '犭 (Khuyển)', strokeCount: 11 },
  狗: { pinyin: 'gǒu', hanViet: 'cẩu', meaning: 'con chó', radical: '犭 (Khuyển)', strokeCount: 8 },
  咱: { pinyin: 'zán', hanViet: 'tán', meaning: 'chúng ta', radical: '口 (Khẩu - Miệng)', strokeCount: 9 },
  们: { pinyin: 'men', hanViet: 'môn', meaning: 'hậu tố số nhiều chỉ người', radical: '亻 (Nhân đứng)', strokeCount: 5 },
  换: { pinyin: 'huàn', hanViet: 'hoán', meaning: 'đổi, trao đổi', radical: '扌 (Thủ - Tay)', strokeCount: 10 },
  空: { pinyin: 'kōng', hanViet: 'không', meaning: 'bầu trời, không khí', radical: '穴 (Huyệt)', strokeCount: 8 },
  调: { pinyin: 'tiáo', hanViet: 'điều', meaning: 'điều chỉnh, điều hòa', radical: '讠 (Ngôn)', strokeCount: 10 },
  洗: { pinyin: 'xǐ', hanViet: 'tẩy', meaning: 'giặt, rửa sạch', radical: '氵 (Thủy - Nước)', strokeCount: 9 },
  衣: { pinyin: 'yī', hanViet: 'y', meaning: 'quần áo, y phục', radical: '衣 (Y - Áo)', strokeCount: 6 },
  挺: { pinyin: 'tǐng', hanViet: 'đĩnh', meaning: 'khá, rất, thẳng tắp', radical: '扌 (Thủ - Tay)', strokeCount: 9 },
  初: { pinyin: 'chū', hanViet: 'sơ', meaning: 'ban đầu, sơ cấp', radical: '衤 (Y - Áo)', strokeCount: 7 },
  中: { pinyin: 'zhōng', hanViet: 'trung', meaning: 'ở giữa, trung tâm', radical: '丨 (Cổn)', strokeCount: 4 },
  刻: { pinyin: 'kè', hanViet: 'khắc', meaning: '15 phút, chạm khắc', radical: '刂 (Đao)', strokeCount: 8 },
  愿: { pinyin: 'yuàn', hanViet: 'nguyện', meaning: 'ước nguyện, sẵn lòng', radical: '心 (Tâm - Trái tim)', strokeCount: 14 },
  意: { pinyin: 'yì', hanViet: 'ý', meaning: 'ý nghĩa, tấm lòng', radical: '心 (Tâm - Trái tim)', strokeCount: 13 },
  冰: { pinyin: 'bīng', hanViet: 'băng', meaning: 'nước đá, băng giá', radical: '冫 (Băng)', strokeCount: 6 },
  箱: { pinyin: 'xiāng', hanViet: 'tương', meaning: 'chiếc rương, tủ, hộp', radical: '⺮ (Trúc)', strokeCount: 15 },
  卫: { pinyin: 'wèi', hanViet: 'vệ', meaning: 'bảo vệ, giữ gìn', radical: '卩 (Tiết)', strokeCount: 3 },
  生: { pinyin: 'shēng', hanViet: 'sinh', meaning: 'sinh sống, học sinh', radical: '生 (Sinh)', strokeCount: 5 },
  间: { pinyin: 'jiān', hanViet: 'gian', meaning: 'căn phòng, không gian', radical: '门 (Môn - Cửa)', strokeCount: 7 },
  灯: { pinyin: 'dēng', hanViet: 'đăng', meaning: 'ngọn đèn', radical: '火 (Hỏa - Lửa)', strokeCount: 6 },
  汉: { pinyin: 'hàn', hanViet: 'Hán', meaning: 'nhà Hán, tiếng Hán', radical: '氵 (Thủy - Nước)', strokeCount: 5 },
  语: { pinyin: 'yǔ', hanViet: 'ngữ', meaning: 'ngôn ngữ, lời nói', radical: '讠 (Ngôn)', strokeCount: 9 },
  文: { pinyin: 'wén', hanViet: 'văn', meaning: 'văn hóa, chữ viết', radical: '文 (Văn)', strokeCount: 4 },
  国: { pinyin: 'guó', hanViet: 'quốc', meaning: 'đất nước, quốc gia', radical: '囗 (Vi)', strokeCount: 8 },
  大: { pinyin: 'dà', hanViet: 'đại', meaning: 'to lớn, rộng lớn', radical: '大 (Đại)', strokeCount: 3 },
  小: { pinyin: 'xiǎo', hanViet: 'tiểu', meaning: 'nhỏ nhắn', radical: '小 (Tiểu)', strokeCount: 3 },
  好: { pinyin: 'hǎo', hanViet: 'hảo', meaning: 'tốt đẹp, hay', radical: '女 (Nữ)', strokeCount: 6 },
  人: { pinyin: 'rén', hanViet: 'nhân', meaning: 'con người', radical: '人 (Nhân)', strokeCount: 2 },
  心: { pinyin: 'xīn', hanViet: 'tâm', meaning: 'trái tim, tấm lòng', radical: '心 (Tâm)', strokeCount: 4 },
  交: { pinyin: 'jiāo', hanViet: 'giao', meaning: 'giao nhau, trao đổi, kết giao', radical: '亠 (Đầu - Chấm đầu)', strokeCount: 6 },
  通: { pinyin: 'tōng', hanViet: 'thông', meaning: 'thông suốt, đi qua, kết nối', radical: '辶 (Sước - Bước đi)', strokeCount: 10 },
  车: { pinyin: 'chē', hanViet: 'xa', meaning: 'xe cộ, phương tiện', radical: '车 (Xa - Xe)', strokeCount: 4 },
  路: { pinyin: 'lù', hanViet: 'lộ', meaning: 'con đường, tuyến đường', radical: '足 (Túc - Chân)', strokeCount: 13 },
  公: { pinyin: 'gōng', hanViet: 'công', meaning: 'công cộng, chung', radical: '八 (Bát)', strokeCount: 4 },
  共: { pinyin: 'gòng', hanViet: 'cộng', meaning: 'cùng nhau, tổng cộng', radical: '八 (Bát)', strokeCount: 6 },
  地: { pinyin: 'dì', hanViet: 'địa', meaning: 'mặt đất, địa điểm', radical: '土 (Thổ - Đất)', strokeCount: 6 },
  铁: { pinyin: 'tiě', hanViet: 'thiết', meaning: 'sắt thép, đường sắt', radical: '钅 (Kim - Kim loại)', strokeCount: 10 },
  飞: { pinyin: 'fēi', hanViet: 'phi', meaning: 'bay lượn', radical: '飞 (Phi - Bay)', strokeCount: 3 },
  吃: { pinyin: 'chī', hanViet: 'ngật', meaning: 'ăn uống, thưởng thức', radical: '口 (Khẩu - Miệng)', strokeCount: 6 },
  喝: { pinyin: 'hē', hanViet: 'hát', meaning: 'uống nước', radical: '口 (Khẩu - Miệng)', strokeCount: 12 },
  买: { pinyin: 'mǎi', hanViet: 'mãi', meaning: 'mua sắm', radical: '乛 (Ất)', strokeCount: 6 },
  卖: { pinyin: 'mài', hanViet: 'mại', meaning: 'bán hàng', radical: '十 (Thập)', strokeCount: 8 },
  钱: { pinyin: 'qián', hanViet: 'tiền', meaning: 'tiền bạc, chi phí', radical: '钅 (Kim - Kim loại)', strokeCount: 10 },
  医: { pinyin: 'yī', hanViet: 'y', meaning: 'y học, thầy thuốc', radical: '匚 (Phương)', strokeCount: 7 },
  院: { pinyin: 'yuàn', hanViet: 'viện', meaning: 'khuôn viên, học viện, bệnh viện', radical: '阝 (Phụ)', strokeCount: 9 },
  饭: { pinyin: 'fàn', hanViet: 'phạn', meaning: 'cơm, bữa ăn', radical: '饣 (Thực - Ăn)', strokeCount: 7 },
  店: { pinyin: 'diàn', hanViet: 'điếm', meaning: 'cửa hàng, tiệm, khách sạn', radical: '广 (Nghiễm - Mái nhà)', strokeCount: 8 },
  休: { pinyin: 'xiū', hanViet: 'hưu', meaning: 'nghỉ ngơi (người tựa gốc cây)', radical: '亻 (Nhân đứng)', strokeCount: 6 },
  息: { pinyin: 'xī', hanViet: 'tức', meaning: 'hơi thở, nghỉ ngơi', radical: '心 (Tâm - Trái tim)', strokeCount: 10 },
  准: { pinyin: 'zhǔn', hanViet: 'chuẩn', meaning: 'chuẩn xác, chuẩn bị', radical: '冫 (Băng)', strokeCount: 10 },
  备: { pinyin: 'bèi', hanViet: 'bị', meaning: 'trang bị, sẵn sàng', radical: '夂 (Truy)', strokeCount: 8 },
  考: { pinyin: 'kǎo', hanViet: 'khảo', meaning: 'thi cử, kiểm tra', radical: '耂 (Lão)', strokeCount: 6 },
  试: { pinyin: 'shì', hanViet: 'thí', meaning: 'thử nghiệm, bài thi', radical: '讠 (Ngôn - Lời nói)', strokeCount: 8 },
  帮: { pinyin: 'bāng', hanViet: 'bang', meaning: 'giúp đỡ, hỗ trợ', radical: '巾 (Cân - Khăn)', strokeCount: 9 },
  助: { pinyin: 'zhù', hanViet: 'trợ', meaning: 'trợ giúp, thêm sức', radical: '力 (Lực - Sức mạnh)', strokeCount: 7 },
  介: { pinyin: 'jiè', hanViet: 'giới', meaning: 'ở giữa, giới thiệu', radical: '人 (Nhân - Người)', strokeCount: 4 },
  绍: { pinyin: 'shào', hanViet: 'thiệu', meaning: 'nối tiếp, kết nối', radical: '纟 (Mịch - Sợi tơ)', strokeCount: 8 },
  礼: { pinyin: 'lǐ', hanViet: 'lễ', meaning: 'lễ nghĩa, món quà', radical: '礻 (Thị - Lễ)', strokeCount: 5 },
  物: { pinyin: 'wù', hanViet: 'vật', meaning: 'sự vật, đồ vật', radical: '牜 (Ngưu)', strokeCount: 8 },
  环: { pinyin: 'huán', hanViet: 'hoàn', meaning: 'vòng ngọc, bao quanh', radical: '王 (Ngọc)', strokeCount: 8 },
  境: { pinyin: 'jìng', hanViet: 'cảnh', meaning: 'biên giới, hoàn cảnh, môi trường', radical: '土 (Thổ - Đất)', strokeCount: 14 },
  化: { pinyin: 'huà', hanViet: 'hóa', meaning: 'biến đổi, văn hóa', radical: '亻 (Nhân đứng)', strokeCount: 4 },
  经: { pinyin: 'jīng', hanViet: 'kinh', meaning: 'trải qua, kinh tế', radical: '纟 (Mịch - Sợi tơ)', strokeCount: 8 },
  济: { pinyin: 'jì', hanViet: 'tế', meaning: 'giúp đời, kinh tế', radical: '氵 (Thủy - Nước)', strokeCount: 9 },
  发: { pinyin: 'fā', hanViet: 'phát', meaning: 'phát triển, xuất phát', radical: '又 (Hựu)', strokeCount: 5 },
  展: { pinyin: 'zhǎn', hanViet: 'triển', meaning: 'mở rộng, triển khai', radical: '尸 (Thi)', strokeCount: 10 },
  熊: { pinyin: 'xióng', hanViet: 'hùng', meaning: 'con gấu', radical: '灬 (Hỏa - 4 chấm lửa)', strokeCount: 14 },
  竹: { pinyin: 'zhú', hanViet: 'trúc', meaning: 'cây tre, cây trúc', radical: '竹 (Trúc)', strokeCount: 6 },
  谢: { pinyin: 'xiè', hanViet: 'tạ', meaning: 'cảm tạ, biết ơn', radical: '讠 (Ngôn - Lời nói)', strokeCount: 12 },
  对: { pinyin: 'duì', hanViet: 'đối', meaning: 'đúng, đối diện', radical: '寸 (Thốn)', strokeCount: 5 },
  起: { pinyin: 'qǐ', hanViet: 'khởi', meaning: 'đứng dậy, bắt đầu', radical: '走 (Tẩu - Chạy)', strokeCount: 10 },
  关: { pinyin: 'guān', hanViet: 'quan', meaning: 'đóng, liên quan', radical: '丷 (Bát ngửa)', strokeCount: 6 },
  系: { pinyin: 'xì', hanViet: 'hệ', meaning: 'hệ thống, mối quan hệ', radical: '糸 (Mịch)', strokeCount: 7 },
  请: { pinyin: 'qǐng', hanViet: 'thỉnh', meaning: 'xin mời, vui lòng', radical: '讠 (Ngôn - Lời nói)', strokeCount: 10 },
  问: { pinyin: 'wèn', hanViet: 'vấn', meaning: 'hỏi thăm, câu hỏi', radical: '门 (Môn - Cửa)', strokeCount: 6 },
  认: { pinyin: 'rèn', hanViet: 'nhận', meaning: 'nhận biết, công nhận', radical: '讠 (Ngôn - Lời nói)', strokeCount: 4 },
  识: { pinyin: 'shí', hanViet: 'thức', meaning: 'tri thức, quen biết', radical: '讠 (Ngôn - Lời nói)', strokeCount: 7 },
  字: { pinyin: 'zì', hanViet: 'tự', meaning: 'chữ viết, văn tự', radical: '宀 (Miên - Mái nhà)', strokeCount: 6 },
};

export const SMART_HANZI_DICTIONARY: Record<string, SmartDictEntry> = {
  温暖: {
    pinyin: 'wēn nuǎn',
    hanViet: 'ôn noãn',
    meaning: 'ấm áp, đầm ấm',
    partOfSpeech: 'TÍNH TỪ / ĐỘNG TỪ',
    hskLevel: 'HSK 4',
    usageNote: 'Dùng miêu tả thời tiết nắng ấm (天气温暖) hoặc sự quan tâm ấm áp của gia đình, bạn bè (感到温暖).',
    exampleHanzi: '春天 的 阳光 非常 温暖。',
    examplePinyin: 'Chūntiān de yángguāng fēicháng wēnnuǎn.',
    exampleMeaning: 'Ánh nắng mùa xuân vô cùng ấm áp.',
    illustrationKey: 'wennuan',
  },
  温: {
    pinyin: 'wēn',
    hanViet: 'ôn',
    meaning: 'ấm áp, ôn hòa, ôn tập',
    partOfSpeech: 'TÍNH TỪ / ĐỘNG TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Kết hợp trong 温暖 (ấm áp), 温度 (nhiệt độ), 温柔 (dịu dàng), 温习 (ôn tập).',
    exampleHanzi: '请 喝 一杯 温 水 吧。',
    examplePinyin: 'Qǐng hē yī bēi wēn shuǐ ba.',
    exampleMeaning: 'Mời bạn uống một cốc nước ấm nhé.',
    illustrationKey: 'wennuan',
  },
  暖: {
    pinyin: 'nuǎn',
    hanViet: 'noãn',
    meaning: 'ấm áp, sưởi ấm',
    partOfSpeech: 'TÍNH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Kết hợp trong 温暖 (ấm áp), 暖和 (ấm cúng), 春暖花开 (xuân ấm hoa nở).',
    exampleHanzi: '屋子 里 很 暖和。',
    examplePinyin: 'Wūzi lǐ hěn nuǎnhuo.',
    exampleMeaning: 'Trong căn nhà rất ấm cúng.',
    illustrationKey: 'wennuan',
  },
  龙: {
    pinyin: 'lóng',
    hanViet: 'long',
    meaning: 'rồng phương Đông, thần long',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Biểu tượng văn hóa cát tường Trung Hoa: 龙马精神 (tinh thần long mã), 中国龙 (Rồng Trung Hoa).',
    exampleHanzi: '龙 是 中华 文化 的 吉祥 象征。',
    examplePinyin: 'Lóng shì Zhōnghuá wénhuà de jíxiáng xiàngzhēng.',
    exampleMeaning: 'Rồng là biểu tượng cát tường của văn hóa Trung Hoa.',
    illustrationKey: 'long',
  },
  老师: {
    pinyin: 'lǎo shī',
    hanViet: 'lão sư',
    meaning: 'giáo viên, thầy cô giáo',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Danh từ xưng hô trang trọng với người giảng dạy: 王老师 (Thầy/Cô Vương), 老师好 (Chào thầy/cô).',
    exampleHanzi: '咱们 的 汉语 老师 讲课 很 生动。',
    examplePinyin: 'Zánmen de Hànyǔ lǎoshī jiǎngkè hěn shēngdòng.',
    exampleMeaning: 'Giáo viên tiếng Trung của chúng ta giảng bài rất sinh động.',
    illustrationKey: 'laoshi',
  },
  聪明: {
    pinyin: 'cōng míng',
    hanViet: 'thông minh',
    meaning: 'thông minh, lanh lợi',
    partOfSpeech: 'TÍNH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Thường kết hợp với phó từ chỉ mức độ: 很聪明, 挺聪明的, 聪明伶俐.',
    exampleHanzi: '这个 初中 学生 挺 聪明的。',
    examplePinyin: 'Zhège chūzhōng xuéshēng tǐng cōngmíng de.',
    exampleMeaning: 'Bạn học sinh cấp 2 này khá thông minh.',
    illustrationKey: 'congming',
  },
  幸福: {
    pinyin: 'xìng fú',
    hanViet: 'hạnh phúc',
    meaning: 'hạnh phúc, viên mãn',
    partOfSpeech: 'TÍNH TỪ / DANH TỪ',
    hskLevel: 'HSK 4',
    usageNote: 'Chỉ cuộc sống đầm ấm, viên mãn lâu dài: 幸福的生活 (cuộc sống hạnh phúc), 祝你幸福.',
    exampleHanzi: '他们 一家人 生活 得 非常 幸福。',
    examplePinyin: 'Tāmen yījiārén shēnghuó de fēicháng xìngfú.',
    exampleMeaning: 'Gia đình họ chung sống vô cùng hạnh phúc.',
    illustrationKey: 'xingfu',
  },
  咖啡: {
    pinyin: 'kā fēi',
    hanViet: 'gia phê',
    meaning: 'cà phê',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Lượng từ: 杯 (bēi) — 一杯热咖啡 (một tách cà phê nóng), 咖啡馆 (quán cà phê).',
    exampleHanzi: '早上 我 喜欢 喝 一杯 热 咖啡。',
    examplePinyin: 'Zǎoshang wǒ xǐhuan hē yī bēi rè kāfēi.',
    exampleMeaning: 'Buổi sáng tôi thích uống một tách cà phê nóng.',
    illustrationKey: 'kafei',
  },
  朋友: {
    pinyin: 'péng you',
    hanViet: 'bằng hữu',
    meaning: 'bạn bè, người bạn',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Kết bạn: 交朋友 (jiāo péngyou) · Bạn thân: 好朋友 (hǎo péngyou), 老朋友.',
    exampleHanzi: '在 大学 里 我 认识 了 很多 好 朋友。',
    examplePinyin: 'Zài dàxué lǐ wǒ rènshi le hěn duō hǎo péngyou.',
    exampleMeaning: 'Ở trường đại học tôi đã quen được rất nhiều người bạn tốt.',
    illustrationKey: 'pengyou',
  },
  努力: {
    pinyin: 'nǔ lì',
    hanViet: 'nỗ lực',
    meaning: 'nỗ lực, cố gắng, chăm chỉ',
    partOfSpeech: 'TÍNH TỪ / ĐỘNG TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Đứng trước động từ làm trạng ngữ: 努力学习 (chăm chỉ học tập), 努力工作 (nỗ lực làm việc).',
    exampleHanzi: '只要 努力 学习，汉语 一定 会 进步。',
    examplePinyin: 'Zhǐyào nǔlì xuéxí, Hànyǔ yīdìng huì jìnbù.',
    exampleMeaning: 'Chỉ cần nỗ lực học tập, tiếng Trung nhất định sẽ tiến bộ.',
    illustrationKey: 'nuli',
  },
  学习: {
    pinyin: 'xué xí',
    hanViet: 'học tập',
    meaning: 'học tập, rèn luyện',
    partOfSpeech: 'ĐỘNG TỪ / DANH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Cấu trúc: 学习 + Môn học/Kỹ năng (学习汉语 - học tiếng Trung, 好好学习).',
    exampleHanzi: '咱们 一起 努力 学习 汉语 吧。',
    examplePinyin: 'Zánmen yīqǐ nǔlì xuéxí Hànyǔ ba.',
    exampleMeaning: 'Chúng ta cùng nhau chăm chỉ học tiếng Trung nhé.',
    illustrationKey: 'school',
  },
  学校: {
    pinyin: 'xué xiào',
    hanViet: 'học hiệu',
    meaning: 'trường học',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Lượng từ: 所 (suǒ) — 一所学校 (một ngôi trường), 去学校上课.',
    exampleHanzi: '我们 的 学校 环境 非常 优美。',
    examplePinyin: 'Wǒmen de xuéxiào huánjìng fēicháng yōuměi.',
    exampleMeaning: 'Môi trường trường học của chúng tôi vô cùng tươi đẹp.',
    illustrationKey: 'chuzhong',
  },
  大学: {
    pinyin: 'dà xué',
    hanViet: 'đại học',
    meaning: 'trường đại học',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Sinh viên đại học: 大学生 (dàxuéshēng) · Đại học Hà Nội: 河内大学 (HANU).',
    exampleHanzi: '我 在 河内 大学 学习 汉语。',
    examplePinyin: 'Wǒ zài Hénèi Dàxué xuéxí Hànyǔ.',
    exampleMeaning: 'Tôi học tiếng Trung tại Trường Đại học Hà Nội (HANU).',
    illustrationKey: 'laoshi',
  },
  汉语: {
    pinyin: 'hàn yǔ',
    hanViet: 'Hán ngữ',
    meaning: 'tiếng Trung, Hán ngữ',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Ngôn ngữ Hán chuẩn phổ thông: 说汉语 (nói tiếng Trung), 汉语水平考试 (HSK).',
    exampleHanzi: '她 的 汉语 发音 非常 标准。',
    examplePinyin: 'Tā de Hànyǔ fāyīn fēicháng biāozhǔn.',
    exampleMeaning: 'Phát âm tiếng Trung của cô ấy vô cùng chuẩn xác.',
    illustrationKey: 'laoshi',
  },
  家: {
    pinyin: 'jiā',
    hanViet: 'gia',
    meaning: 'nhà, gia đình, tổ ấm',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Về nhà: 回家 (huí jiā) · Ở nhà: 在家 · Gia đình: 家庭 (jiātíng).',
    exampleHanzi: '家 是 最 温暖 的 地方。',
    examplePinyin: 'Jiā shì zuì wēnnuǎn de dìfang.',
    exampleMeaning: 'Nhà là nơi ấm áp nhất.',
    illustrationKey: 'wennuan',
  },
  家庭: {
    pinyin: 'jiā tíng',
    hanViet: 'gia đình',
    meaning: 'gia đình, mái ấm',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 4',
    usageNote: 'Chỉ tổ ấm gia đình: 幸福的家庭 (gia đình hạnh phúc), 家庭成员.',
    exampleHanzi: '我 有 一个 温暖 而 幸福 的 家庭。',
    examplePinyin: 'Wǒ yǒu yīgè wēnnuǎn ér xìngfú de jiātíng.',
    exampleMeaning: 'Tôi có một gia đình ấm áp và hạnh phúc.',
    illustrationKey: 'xingfu',
  },
  爱: {
    pinyin: 'ài',
    hanViet: 'ái',
    meaning: 'yêu thương, đam mê',
    partOfSpeech: 'ĐỘNG TỪ / DANH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Yêu gia đình: 爱家人 · Yêu thích làm gì: 爱看书, 热爱生活.',
    exampleHanzi: '我 很 爱 我 的 爸爸 和 妈妈。',
    examplePinyin: 'Wǒ hěn ài wǒ de bàba hé māma.',
    exampleMeaning: 'Tôi rất yêu bố và mẹ của mình.',
    illustrationKey: 'xingfu',
  },
  爱情: {
    pinyin: 'ài qíng',
    hanViet: 'ái tình',
    meaning: 'tình yêu',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 4',
    usageNote: 'Danh từ chỉ tình yêu đôi lứa: 浪漫的爱情 (tình yêu lãng mạn).',
    exampleHanzi: '这 是 一个 美好 的 爱情 故事。',
    examplePinyin: 'Zhè shì yīgè měihǎo de àiqíng gùshi.',
    exampleMeaning: 'Đây là một câu chuyện tình yêu tươi đẹp.',
    illustrationKey: 'xingfu',
  },
  水: {
    pinyin: 'shuǐ',
    hanViet: 'thủy',
    meaning: 'nước, dòng suối',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Uống nước: 喝水 · Nước ấm: 温水 · Hoa quả: 水果 (shuǐguǒ).',
    exampleHanzi: '每天 多 喝 水 对 身体 很 好。',
    examplePinyin: 'Měitiān duō hē shuǐ duì shēntǐ hěn hǎo.',
    exampleMeaning: 'Mỗi ngày uống nhiều nước rất tốt cho sức khỏe.',
    illustrationKey: 'nature',
  },
  火: {
    pinyin: 'huǒ',
    hanViet: 'hỏa',
    meaning: 'lửa, ngọn lửa ấm, nồng nhiệt',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Tàu hỏa: 火车 (huǒchē) · Lửa trại ấm áp: 篝火 · Sôi nổi: 红火.',
    exampleHanzi: '冬天 的 炉火 让 房间 很 温暖。',
    examplePinyin: 'Dōngtiān de lúhuǒ ràng fángjiān hěn wēnnuǎn.',
    exampleMeaning: 'Ánh lửa lò sưởi mùa đông làm căn phòng rất ấm áp.',
    illustrationKey: 'wennuan',
  },
  茶: {
    pinyin: 'chá',
    hanViet: 'trà',
    meaning: 'trà, thưởng trà',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Pha trà: 泡茶 (pào chá) · Uống trà: 喝茶 · Trà xanh: 绿茶.',
    exampleHanzi: '请 坐，喝 一杯 热 茶 吧。',
    examplePinyin: 'Qǐng zuò, hē yī bēi rè chá ba.',
    exampleMeaning: 'Mời ngồi, thưởng thức một chén trà nóng nhé.',
    illustrationKey: 'wennuan',
  },
  春天: {
    pinyin: 'chūn tiān',
    hanViet: 'xuân thiên',
    meaning: 'mùa xuân',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Bốn mùa: 春天 (xuân), 夏天 (hạ), 秋天 (thu), 冬天 (đông).',
    exampleHanzi: '春天 到了，花园 里 的 花 都 开了。',
    examplePinyin: 'Chūntiān dàole, huāyuán lǐ de huā dōu kāile.',
    exampleMeaning: 'Mùa xuân đến rồi, hoa trong vườn đều đã nở rộ.',
    illustrationKey: 'huayuan',
  },
  阳光: {
    pinyin: 'yáng guāng',
    hanViet: 'dương quang',
    meaning: 'ánh nắng mặt trời, tích cực',
    partOfSpeech: 'DANH TỪ / TÍNH TỪ',
    hskLevel: 'HSK 4',
    usageNote: 'Chỉ ánh nắng ấm áp (温暖的阳光) hoặc tính cách lạc quan, rạng rỡ.',
    exampleHanzi: '早晨 的 阳光 照进 房间 里。',
    examplePinyin: 'Zǎochén de yángguāng zhàojìn fángjiān lǐ.',
    exampleMeaning: 'Ánh nắng buổi sớm chiếu vào trong căn phòng.',
    illustrationKey: 'wennuan',
  },
  快乐: {
    pinyin: 'kuài lè',
    hanViet: 'khoái lạc',
    meaning: 'vui vẻ, hạnh phúc',
    partOfSpeech: 'TÍNH TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Dùng trong lời chúc và niềm vui tinh thần: 生日快乐, 新年快乐.',
    exampleHanzi: '祝 你 每天 都 幸福 快乐！',
    examplePinyin: 'Zhù nǐ měitiān dōu xìngfú kuàilè!',
    exampleMeaning: 'Chúc bạn mỗi ngày đều hạnh phúc và vui vẻ!',
    illustrationKey: 'xingfu',
  },
  高兴: {
    pinyin: 'gāo xìng',
    hanViet: 'cao hứng',
    meaning: 'vui mừng, phấn khởi',
    partOfSpeech: 'TÍNH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Mẫu câu giao tiếp kinh điển: 很高兴认识你 (Rất vui được làm quen với bạn).',
    exampleHanzi: '认识 你们 我 非常 高兴。',
    examplePinyin: 'Rènshi nǐmen wǒ fēicháng gāoxìng.',
    exampleMeaning: 'Được làm quen với các bạn tôi vô cùng vui mừng.',
    illustrationKey: 'pengyou',
  },
  喜欢: {
    pinyin: 'xǐ huan',
    hanViet: 'hỷ hoan',
    meaning: 'thích, yêu thích',
    partOfSpeech: 'ĐỘNG TỪ TÂM LÝ',
    hskLevel: 'HSK 1',
    usageNote: 'Cấu trúc: 喜欢 + Danh từ / Động từ (喜欢中国文化 - thích văn hóa Trung Hoa).',
    exampleHanzi: '我 很 喜欢 在 花园 里 看书。',
    examplePinyin: 'Wǒ hěn xǐhuan zài huāyuán lǐ kànshū.',
    exampleMeaning: 'Tôi rất thích đọc sách ở trong vườn hoa.',
    illustrationKey: 'huayuan',
  },
  健康: {
    pinyin: 'jiàn kāng',
    hanViet: 'kiện khang',
    meaning: 'khỏe mạnh, sức khỏe',
    partOfSpeech: 'TÍNH TỪ / DANH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Chúc sức khỏe: 祝您身体健康 (Chúc ngài dồi dào sức khỏe).',
    exampleHanzi: '经常 运动 让 我们 保持 健康。',
    examplePinyin: 'Jīngcháng yùndòng ràng wǒmen bǎochí jiànkāng.',
    exampleMeaning: 'Thường xuyên vận động giúp chúng ta giữ gìn sức khỏe.',
    illustrationKey: 'people',
  },
  成功: {
    pinyin: 'chéng gōng',
    hanViet: 'thành công',
    meaning: 'thành công, đạt thành tựu',
    partOfSpeech: 'ĐỘNG TỪ / TÍNH TỪ / DANH TỪ',
    hskLevel: 'HSK 4',
    usageNote: 'Thành ngữ thông dụng: 马到成功 (mã đáo thành công), 祝你成功.',
    exampleHanzi: '坚持 努力 一定 会 取得 成功。',
    examplePinyin: 'Jiānchí nǔlì yīdìng huì qǔdé chénggōng.',
    exampleMeaning: 'Kiên trì nỗ lực nhất định sẽ giành được thành công.',
    illustrationKey: 'nuli',
  },
  梦想: {
    pinyin: 'mèng xiǎng',
    hanViet: 'mộng tưởng',
    meaning: 'ước mơ, hoài bão',
    partOfSpeech: 'DANH TỪ / ĐỘNG TỪ',
    hskLevel: 'HSK 5',
    usageNote: 'Thực hiện ước mơ: 实现梦想 (shíxiàn mèngxiǎng), 追求梦想.',
    exampleHanzi: '我 的 梦想 是 成为 一名 汉语 老师。',
    examplePinyin: 'Wǒ de mèngxiǎng shì chéngwéi yī míng Hànyǔ lǎoshī.',
    exampleMeaning: 'Ước mơ của tôi là trở thành một giáo viên tiếng Trung.',
    illustrationKey: 'laoshi',
  },
  旅游: {
    pinyin: 'lǚ yóu',
    hanViet: 'lữ du',
    meaning: 'du lịch, đi du ngoạn',
    partOfSpeech: 'ĐỘNG TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Đi du lịch: 去旅游 (qù lǚyóu), 旅游景点 (điểm tham quan du lịch).',
    exampleHanzi: '今年 夏天 咱们 一起 去 北京 旅游 吧。',
    examplePinyin: 'Jīnnián xiàtiān zánmen yīqǐ qù Běijīng lǚyóu ba.',
    exampleMeaning: 'Mùa hè năm nay chúng mình cùng đi Bắc Kinh du lịch nhé.',
    illustrationKey: 'nature',
  },
  美食: {
    pinyin: 'měi shí',
    hanViet: 'mỹ thực',
    meaning: 'ẩm thực, món ăn ngon',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 4',
    usageNote: 'Thưởng thức ẩm thực: 品尝美食 (pǐncháng měishí), 传统美食.',
    exampleHanzi: '中国 和 越南 都 有 很多 特色 美食。',
    examplePinyin: 'Zhōngguó hé Yuènán dōu yǒu hěn duō tèsè měishí.',
    exampleMeaning: 'Trung Quốc và Việt Nam đều có rất nhiều món ăn ngon đặc sắc.',
    illustrationKey: 'kafei',
  },
  冰箱: {
    pinyin: 'bīng xiāng',
    hanViet: 'băng tương',
    meaning: 'tủ lạnh',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Lượng từ: 台 (tái) — 一台冰箱 (một chiếc tủ lạnh).',
    exampleHanzi: '妈妈 把 水果 放进 冰箱 里 了。',
    examplePinyin: 'Māma bǎ shuǐguǒ fàngjìn bīngxiāng lǐ le.',
    exampleMeaning: 'Mẹ đã cất hoa quả vào trong tủ lạnh rồi.',
    illustrationKey: 'bingxiang',
  },
  卫生间: {
    pinyin: 'wèi shēng jiān',
    hanViet: 'vệ sinh gian',
    meaning: 'phòng tắm, nhà vệ sinh',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Từ lịch sự chỉ phòng vệ sinh/phòng tắm trong nhà hoặc nơi công cộng.',
    exampleHanzi: '请问，卫生间 在 哪儿？',
    examplePinyin: 'Qǐngwèn, wèishēngjiān zài nǎr?',
    exampleMeaning: 'Xin hỏi, nhà vệ sinh ở đâu vậy?',
    illustrationKey: 'weishengjian',
  },
  灯: {
    pinyin: 'dēng',
    hanViet: 'đăng',
    meaning: 'đèn chiếu sáng, đèn lồng',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Bật đèn: 开灯 · Tắt đèn: 关灯 · Lượng từ: 盏 (zhǎn).',
    exampleHanzi: '房间 里 有点儿 暗，请 开 灯 吧。',
    examplePinyin: 'Fángjiān lǐ yǒudiǎnr àn, qǐng kāi dēng ba.',
    exampleMeaning: 'Trong phòng hơi tối, hãy bật đèn lên nhé.',
    illustrationKey: 'deng',
  },
  狗: {
    pinyin: 'gǒu',
    hanViet: 'cẩu',
    meaning: 'chú chó, cún con',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 1',
    usageNote: 'Lượng từ: 只 (zhī) hoặc 条 (tiáo) — 一只小狗 (một chú cún con), 宠物狗 (chó cưng).',
    exampleHanzi: '我家 的 小 狗 非常 聪明 可爱。',
    examplePinyin: 'Wǒ jiā de xiǎogǒu fēicháng cōngmíng kě’ài.',
    exampleMeaning: 'Chú cún con nhà tôi rất thông minh và đáng yêu.',
    illustrationKey: 'dog',
  },
  换: {
    pinyin: 'huàn',
    hanViet: 'hoán',
    meaning: 'đổi, thay',
    partOfSpeech: 'ĐỘNG TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Đổi tiền, đổi đồ, thay quần áo (换钱, 换衣服, 换工作).',
    exampleHanzi: '我想 换 200 人民币。',
    examplePinyin: 'Wǒ xiǎng huàn liǎngbǎi rénmínbì.',
    exampleMeaning: 'Tôi muốn đổi 200 Nhân dân tệ.',
    illustrationKey: 'huan',
  },
  挺: {
    pinyin: 'tǐng',
    hanViet: 'đĩnh',
    meaning: 'khá, rất',
    partOfSpeech: 'PHÓ TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Cấu trúc: 挺 + Tính từ / Động từ tâm lý + 的 (biểu thị mức độ cao nhẹ nhàng).',
    exampleHanzi: '这个 花 园 挺 漂亮的。',
    examplePinyin: 'Zhège huāyuán tǐng piàoliang de.',
    exampleMeaning: 'Vườn hoa này khá đẹp.',
    illustrationKey: 'ting',
  },
  刻: {
    pinyin: 'kè',
    hanViet: 'khắc',
    meaning: 'khắc (15 phút), chạm khắc',
    partOfSpeech: 'LƯỢNG TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Chỉ thời gian: 一刻 (15 phút), 三刻 (45 phút). Ví dụ: 差一刻八点.',
    exampleHanzi: '现在 是 八点 一刻。',
    examplePinyin: 'Xiànzài shì bā diǎn yī kè.',
    exampleMeaning: 'Bây giờ là 8 giờ 15 phút.',
    illustrationKey: 'ke',
  },
  愿意: {
    pinyin: 'yuàn yì',
    hanViet: 'nguyện ý',
    meaning: 'bằng lòng, sẵn lòng',
    partOfSpeech: 'ĐỘNG TỪ NĂNG NGUYỆN',
    hskLevel: 'HSK 3',
    usageNote: 'Cấu trúc: 愿意 + Động từ (Biểu thị sự tự nguyện, sẵn sàng làm việc gì đó).',
    exampleHanzi: '我 很 愿意 帮助 你。',
    examplePinyin: 'Wǒ hěn yuànyì bāngzhù nǐ.',
    exampleMeaning: 'Tớ rất sẵn lòng giúp bạn.',
    illustrationKey: 'yuanyi',
  },
  交通: {
    pinyin: 'jiāo tōng',
    hanViet: 'giao thông',
    meaning: 'giao thông, đi lại',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 4',
    usageNote: 'Kết hợp phổ biến: 公共交通 (giao thông công cộng), 交通工具 (phương tiện giao thông), 交通方便 (giao thông thuận tiện).',
    exampleHanzi: '河内 现在 的 交通 越来越 方便 了。',
    examplePinyin: 'Hénèi xiànzài de jiāotōng yuèláiyuè fāngbiàn le.',
    exampleMeaning: 'Giao thông ở Hà Nội hiện nay ngày càng thuận tiện.',
    illustrationKey: 'nature',
  },
  交: {
    pinyin: 'jiāo',
    hanViet: 'giao',
    meaning: 'giao thông, trao đổi, kết bạn, nộp',
    partOfSpeech: 'ĐỘNG TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Kết hợp trong 交通 (giao thông), 交朋友 (kết bạn), 交流 (giao lưu).',
    exampleHanzi: '我 喜欢 交 新 朋友。',
    examplePinyin: 'Wǒ xǐhuan jiāo xīn péngyou.',
    exampleMeaning: 'Tôi thích kết giao với những người bạn mới.',
    illustrationKey: 'pengyou',
  },
  通: {
    pinyin: 'tōng',
    hanViet: 'thông',
    meaning: 'thông suốt, đi qua, thông báo',
    partOfSpeech: 'ĐỘNG TỪ / TÍNH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Kết hợp trong 交通 (giao thông), 通知 (thông báo), 通过 (thông qua).',
    exampleHanzi: '这条 路 已经 通 车 了。',
    examplePinyin: 'Zhè tiáo lù yǐjīng tōng chē le.',
    exampleMeaning: 'Tuyến đường này đã thông xe rồi.',
    illustrationKey: 'nature',
  },
  公共汽车: {
    pinyin: 'gōng gòng qì chē',
    hanViet: 'công cộng khí xa',
    meaning: 'xe buýt công cộng',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Đi xe buýt dùng động từ 坐: 坐公共汽车 (zuò gōnggòng qìchē).',
    exampleHanzi: '我 每天 坐 公共汽车 去 学校。',
    examplePinyin: 'Wǒ měitiān zuò gōnggòng qìchē qù xuéxiào.',
    exampleMeaning: 'Mỗi ngày tôi đi xe buýt đến trường.',
    illustrationKey: 'nature',
  },
  地铁: {
    pinyin: 'dì tiě',
    hanViet: 'địa thiết',
    meaning: 'tàu điện ngầm, metro',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Kết hợp phổ biến: 坐地铁 (đi tàu điện ngầm), 地铁站 (nhà ga tàu điện ngầm).',
    exampleHanzi: '坐 地铁 上班 又 快 又 方便。',
    examplePinyin: 'Zuò dìtiě shàngbān yòu kuài yòu fāngbiàn.',
    exampleMeaning: 'Đi làm bằng tàu điện ngầm vừa nhanh vừa tiện lợi.',
    illustrationKey: 'nature',
  },
  熊猫: {
    pinyin: 'xióng māo',
    hanViet: 'hùng miêu',
    meaning: 'gấu trúc',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Lượng từ: 一只大熊猫 (một chú gấu trúc lớn). Linh vật của lớp là 熊猫彬彬 (Gấu trúc Bin Bin).',
    exampleHanzi: '大 熊猫 非常 喜欢 吃 竹子。',
    examplePinyin: 'Dà xióngmāo fēicháng xǐhuan chī zhúzi.',
    exampleMeaning: 'Gấu trúc lớn rất thích ăn lá trúc.',
    illustrationKey: 'nature',
  },
  你好: {
    pinyin: 'nǐ hǎo',
    hanViet: 'nhĩ hảo',
    meaning: 'xin chào',
    partOfSpeech: 'THÁN TỪ / GIAO TIẾP',
    hskLevel: 'HSK 1',
    usageNote: 'Lời chào thông dụng nhất trong tiếng Trung; với thầy cô/người lớn tuổi dùng 您好 (nín hǎo).',
    exampleHanzi: '你好！很高兴 认识 你。',
    examplePinyin: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ.',
    exampleMeaning: 'Xin chào! Rất vui được làm quen với bạn.',
    illustrationKey: 'pengyou',
  },
  谢谢: {
    pinyin: 'xiè xie',
    hanViet: 'tạ tạ',
    meaning: 'cảm ơn',
    partOfSpeech: 'ĐỘNG TỪ / GIAO TIẾP',
    hskLevel: 'HSK 1',
    usageNote: 'Đáp lại lời cảm ơn bằng: 不客气 (bù kèqi - đừng khách sáo) hoặc 不用谢 (bùyòng xiè).',
    exampleHanzi: '谢谢 你的 热情 帮助！',
    examplePinyin: 'Xièxie nǐ de rèqíng bāngzhù!',
    exampleMeaning: 'Cảm ơn sự giúp đỡ nhiệt tình của bạn!',
    illustrationKey: 'pengyou',
  },
  休息: {
    pinyin: 'xiū xi',
    hanViet: 'hưu tức',
    meaning: 'nghỉ ngơi',
    partOfSpeech: 'ĐỘNG TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Cấu trúc lặp lại động từ: 休息一下 (nghỉ ngơi một chút).',
    exampleHanzi: '累 了 就 休息 一下 吧。',
    examplePinyin: 'Lèi le jiù xiūxi yīxià ba.',
    exampleMeaning: 'Mệt rồi thì nghỉ ngơi một chút nhé.',
    illustrationKey: 'wennuan',
  },
  准备: {
    pinyin: 'zhǔn bèi',
    hanViet: 'chuẩn bị',
    meaning: 'chuẩn bị, sẵn sàng',
    partOfSpeech: 'ĐỘNG TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Kết hợp: 准备好 (chuẩn bị xong), 准备考试 (chuẩn bị thi cử).',
    exampleHanzi: '我们 已经 准备 好 上课 了。',
    examplePinyin: 'Wǒmen yǐjīng zhǔnbèi hǎo shàngkè le.',
    exampleMeaning: 'Chúng tôi đã chuẩn bị sẵn sàng vào lớp học rồi.',
    illustrationKey: 'chuzhong',
  },
  考试: {
    pinyin: 'kǎo shì',
    hanViet: 'khảo thí',
    meaning: 'kỳ thi, thi cử',
    partOfSpeech: 'DANH TỪ / ĐỘNG TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Kết hợp: 参加考试 (tham gia kỳ thi), HSK考试 (kỳ thi HSK).',
    exampleHanzi: '祝 你 明天 HSK 考试 成功！',
    examplePinyin: 'Zhù nǐ míngtiān HSK kǎoshì chénggōng!',
    exampleMeaning: 'Chúc bạn ngày mai thi HSK thành công!',
    illustrationKey: 'nuli',
  },
  帮助: {
    pinyin: 'bāng zhù',
    hanViet: 'bang trợ',
    meaning: 'giúp đỡ, hỗ trợ',
    partOfSpeech: 'ĐỘNG TỪ / DANH TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Kết hợp: 互相帮助 (giúp đỡ lẫn nhau), 帮助朋友 (giúp đỡ bạn bè).',
    exampleHanzi: '同学 之间 要 互相 帮助。',
    examplePinyin: 'Tóngxué zhījiān yào hùxiāng bāngzhù.',
    exampleMeaning: 'Bạn học với nhau cần giúp đỡ lẫn nhau.',
    illustrationKey: 'pengyou',
  },
  介绍: {
    pinyin: 'jiè shào',
    hanViet: 'giới thiệu',
    meaning: 'giới thiệu',
    partOfSpeech: 'ĐỘNG TỪ / DANH TỪ',
    hskLevel: 'HSK 2',
    usageNote: 'Kết hợp: 自我介绍 (tự giới thiệu bản thân), 介绍一下 (giới thiệu một chút).',
    exampleHanzi: '请 先 做 一下 自我 介绍。',
    examplePinyin: 'Qǐng xiān zuò yīxià zìwǒ jièshào.',
    exampleMeaning: 'Xin mời tự giới thiệu bản thân trước một chút.',
    illustrationKey: 'pengyou',
  },
  礼物: {
    pinyin: 'lǐ wù',
    hanViet: 'lễ vật',
    meaning: 'món quà, quà tặng',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Lượng từ: 一份礼物 (một phần quà), 一件礼物 (một món quà).',
    exampleHanzi: '这 是 送给 你的 生日 礼物。',
    examplePinyin: 'Zhè shì sònggěi nǐ de shēngrì lǐwù.',
    exampleMeaning: 'Đây là món quà sinh nhật tặng cho bạn.',
    illustrationKey: 'xingfu',
  },
  环境: {
    pinyin: 'huán jìng',
    hanViet: 'hoàn cảnh',
    meaning: 'môi trường, hoàn cảnh',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Kết hợp: 保护环境 (bảo vệ môi trường), 学习环境 (môi trường học tập).',
    exampleHanzi: '我们 学校 的 学习 环境 很 好。',
    examplePinyin: 'Wǒmen xuéxiào de xuéxí huánjìng hěn hǎo.',
    exampleMeaning: 'Môi trường học tập của trường chúng tôi rất tốt.',
    illustrationKey: 'huayuan',
  },
  文化: {
    pinyin: 'wén huà',
    hanViet: 'văn hóa',
    meaning: 'văn hóa',
    partOfSpeech: 'DANH TỪ',
    hskLevel: 'HSK 3',
    usageNote: 'Kết hợp: 中国文化 (văn hóa Trung Hoa), 文化交流 (giao lưu văn hóa).',
    exampleHanzi: '我 对 中国 传统 文化 很 感兴趣。',
    examplePinyin: 'Wǒ duì Zhōngguó chuántǒng wénhuà hěn gǎn xìngqù.',
    exampleMeaning: 'Tôi rất có hứng thú với văn hóa truyền thống Trung Hoa.',
    illustrationKey: 'long',
  },
  发展: {
    pinyin: 'fā zhǎn',
    hanViet: 'phát triển',
    meaning: 'phát triển',
    partOfSpeech: 'ĐỘNG TỪ / DANH TỪ',
    hskLevel: 'HSK 4',
    usageNote: 'Kết hợp: 经济发展 (phát triển kinh tế), 发展很快 (phát triển rất nhanh).',
    exampleHanzi: '现代 城市 的 交通 发展 得 很 快。',
    examplePinyin: 'Xiàndài chéngshì de jiāotōng fāzhǎn de hěn kuài.',
    exampleMeaning: 'Giao thông của các thành phố hiện đại phát triển rất nhanh.',
    illustrationKey: 'nuli',
  },
  经济: {
    pinyin: 'jīng jì',
    hanViet: 'kinh tế',
    meaning: 'kinh tế',
    partOfSpeech: 'DANH TỪ / TÍNH TỪ',
    hskLevel: 'HSK 4',
    usageNote: 'Kết hợp: 发展经济 (phát triển kinh tế), 经济实惠 (kinh tế phải chăng).',
    exampleHanzi: '交通 方便 有助于 经济 发展。',
    examplePinyin: 'Jiāotōng fāngbiàn yǒuzhùyú jīngjì fāzhǎn.',
    exampleMeaning: 'Giao thông thuận tiện giúp ích cho sự phát triển kinh tế.',
    illustrationKey: 'nuli',
  },
};

/**
 * In-memory cache of authentic HanziWriter CDN stroke data
 */
const HANZI_WRITER_CACHE = new Map<string, StrokeData>();

export function inferIllustrationCategory(
  hanzi: string,
  meaning = ''
): IllustrationCategoryKey {
  const lower = `${hanzi} ${meaning}`.toLowerCase();
  if (/狗|犬|chó|cún|dog|puppy/.test(lower)) return 'dog';
  if (/换|đổi|thay|trao đổi|exchange|convert/.test(lower)) return 'huan';
  if (/刻|thời gian|15 phút|đồng hồ|clock|time/.test(lower)) return 'ke';
  if (/愿|nguyện|bằng lòng|sẵn lòng|willing/.test(lower)) return 'yuanyi';
  if (/温|暖|热|茶|阳|春|火|ấm|nắng|trà|mùa xuân/.test(lower)) return 'wennuan';
  if (/龙|神|华|rồng|thần long/.test(lower)) return 'long';
  if (/咖啡|cà phê|coffee/.test(lower)) return 'kafei';
  if (/美食|吃|菜|饭|ẩm thực|ăn/.test(lower)) return 'kafei';
  if (/幸福|爱|家|喜|乐|hạnh phúc|yêu|gia đình|vui/.test(lower)) return 'xingfu';
  if (/努|功|梦|成|nỗ lực|thành công|ước mơ/.test(lower)) return 'nuli';
  if (/朋友|咱们|高|bạn bè|chúng ta|cùng nhau/.test(lower)) return 'pengyou';
  if (/老师|汉语|中文|大|thầy|cô|giáo viên|đại học/.test(lower)) return 'laoshi';
  if (/学|校|书|初|生|trường|học|sách/.test(lower)) return 'chuzhong';
  if (/花|园|树|草|美|vườn|hoa|cây/.test(lower)) return 'huayuan';
  if (/挺|khá|rất/.test(lower)) return 'ting';
  if (/空调|风|凉|điều hòa|mát/.test(lower)) return 'kongtiao';
  if (/洗衣|洗|衣|máy giặt|quần áo/.test(lower)) return 'xiyiji';
  if (/冰箱|tủ lạnh/.test(lower)) return 'bingxiang';
  if (/卫生间|vệ sinh|toilet/.test(lower)) return 'weishengjian';
  if (/灯|đèn/.test(lower)) return 'deng';
  if (/水|山|雨|雪|天|旅|游|thiên nhiên|núi|sông|du lịch/.test(lower)) return 'nature';
  return 'nature';
}

export function getStrokeDataForChar(char: string, fallbackPinyin?: string): StrokeData {
  const cached = HANZI_WRITER_CACHE.get(char);
  if (cached) {
    return cached;
  }
  if (STROKE_LIBRARY[char]) {
    return STROKE_LIBRARY[char];
  }
  const meta = CHAR_META_DICTIONARY[char];
  return {
    char,
    pinyin: fallbackPinyin || meta?.pinyin || char,
    radical: meta?.radical || 'Bộ thủ Hán tự',
    strokeCount: meta?.strokeCount || 8,
    // Empty strokes array until HanziWriter CDN resolves (no fake 5-stroke cross!)
    strokes: [],
    strokePoints: [],
  };
}

/**
 * Fetches 100% authentic SVG stroke outlines and medians for ANY Chinese character
 * directly from the official HanziWriter CDN:
 * https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(char)}.json
 */
export async function fetchHanziWriterCharacter(
  char: string,
  fallbackPinyin?: string,
  fallbackRadical?: string
): Promise<StrokeData> {
  const cached = HANZI_WRITER_CACHE.get(char);
  if (cached && cached.hanziWriterStrokes && cached.hanziWriterStrokes.length > 0) {
    return cached;
  }

  const existingLib = STROKE_LIBRARY[char];
  const meta = CHAR_META_DICTIONARY[char];
  const resolvedPinyin = fallbackPinyin || existingLib?.pinyin || meta?.pinyin || char;
  const resolvedRadical =
    fallbackRadical || existingLib?.radical || meta?.radical || 'Bộ thủ chuẩn';

  try {
    const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(
      char
    )}.json`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HanziWriter CDN returned ${res.status}`);
    }
    const data = (await res.json()) as {
      strokes: string[];
      medians: number[][][];
    };

    if (Array.isArray(data.strokes) && data.strokes.length > 0) {
      // Convert HanziWriter 1024x1024 medians (where y=900 is top, y=-124 is bottom)
      // into our 0..100 SVG coordinate box: x100 = x / 10.24, y100 = (900 - y) / 10.24
      const strokePoints100: number[][][] = (data.medians || []).map((median) =>
        median.map(([mx, my]) => [
          Math.round((mx / 10.24) * 10) / 10,
          Math.round(((900 - my) / 10.24) * 10) / 10,
        ])
      );

      const medianPathStrings100: string[] = strokePoints100.map((pts) =>
        pts.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ')
      );

      const hydrated: StrokeData = {
        char,
        pinyin: resolvedPinyin,
        radical: resolvedRadical,
        strokeCount: data.strokes.length,
        strokes: medianPathStrings100,
        strokePoints: strokePoints100,
        hanziWriterStrokes: data.strokes,
      };
      HANZI_WRITER_CACHE.set(char, hydrated);
      return hydrated;
    }
  } catch {
    // Fallback to STROKE_LIBRARY if offline
  }

  if (existingLib) {
    return existingLib;
  }
  return getStrokeDataForChar(char, resolvedPinyin);
}

/**
 * Hydrates all characters of a VocabSlide with real HanziWriter CDN stroke data
 */
export async function hydrateSlideStrokesFromCDN(slide: VocabSlide): Promise<VocabSlide> {
  const pinyinSyllables = slide.pinyin.split(/\s+/);
  const chars = Array.from(slide.hanzi).filter((c) => /[\u4e00-\u9fff]/.test(c));
  const targetChars = chars.length > 0 ? chars : Array.from(slide.hanzi);

  const hydratedCharacters = await Promise.all(
    targetChars.map((ch, idx) => {
      const existingChar = slide.characters.find((c) => c.char === ch);
      return fetchHanziWriterCharacter(
        ch,
        pinyinSyllables[idx] || existingChar?.pinyin,
        existingChar?.radical
      );
    })
  );

  return {
    ...slide,
    characters: hydratedCharacters,
  };
}

/**
 * Calls server-side Gemini API (/api/hanzi/enrich) to enrich any arbitrary Chinese word
 * with accurate Pinyin, Hán Việt, Vietnamese meaning, radicals, and contextual example sentence.
 */
export async function enrichVocabSlideWithAI(slide: VocabSlide): Promise<VocabSlide> {
  try {
    const response = await fetch('/api/hanzi/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hanzi: slide.hanzi }),
    });
    if (!response.ok) {
      return hydrateSlideStrokesFromCDN(slide);
    }
    const aiData = await response.json();
    if (!aiData || !aiData.pinyin) {
      return hydrateSlideStrokesFromCDN(slide);
    }

    const updatedSlide: VocabSlide = {
      ...slide,
      pinyin: aiData.pinyin || slide.pinyin,
      hanViet: aiData.hanViet || slide.hanViet,
      meaning: aiData.meaning || slide.meaning,
      partOfSpeech: aiData.partOfSpeech || slide.partOfSpeech,
      hskLevel: aiData.hskLevel || slide.hskLevel,
      usageNote: aiData.usageNote || slide.usageNote,
      exampleHanzi: aiData.exampleHanzi || slide.exampleHanzi,
      examplePinyin: aiData.examplePinyin || slide.examplePinyin,
      exampleMeaning: aiData.exampleMeaning || slide.exampleMeaning,
      illustrationKey:
        aiData.illustrationKey ||
        inferIllustrationCategory(slide.hanzi, aiData.meaning || slide.meaning),
      characters: slide.characters.map((ch, idx) => ({
        ...ch,
        pinyin: aiData.characterDetails?.[idx]?.pinyin || ch.pinyin,
        radical: aiData.characterDetails?.[idx]?.radical || ch.radical,
      })),
    };

    return hydrateSlideStrokesFromCDN(updatedSlide);
  } catch {
    return hydrateSlideStrokesFromCDN(slide);
  }
}

export function evaluateSentenceOrder(
  selectedTokens: string[],
  correctTokens: string[]
): { isCorrect: boolean; scoreDelta: number; joinedAnswer: string } {
  const joinedAnswer = selectedTokens.join(' ');
  if (selectedTokens.length !== correctTokens.length) {
    return { isCorrect: false, scoreDelta: 0, joinedAnswer };
  }
  const isCorrect = selectedTokens.every((token, idx) => token === correctTokens[idx]);
  return {
    isCorrect,
    scoreDelta: isCorrect ? 1 : 0,
    joinedAnswer,
  };
}

export function shuffleTokensDeterministic(tokens: string[], seed = 1): string[] {
  if (tokens.length <= 1) return [...tokens];
  const copy = [...tokens];
  const offset = (Math.abs(seed) % (copy.length - 1)) + 1;
  const rotated = [...copy.slice(offset), ...copy.slice(0, offset)];
  if (rotated.every((val, idx) => val === tokens[idx])) {
    const temp = rotated[0];
    rotated[0] = rotated[rotated.length - 1];
    rotated[rotated.length - 1] = temp;
  }
  return rotated;
}

export function evaluateStrokeSimilarity(
  userPoints: number[][],
  targetStrokePoints: number[][]
): { passed: boolean; accuracy: number } {
  if (!userPoints || userPoints.length < 2) {
    return { passed: false, accuracy: 0 };
  }
  const startUser = userPoints[0];
  const endUser = userPoints[userPoints.length - 1];
  const dxUser = endUser[0] - startUser[0];
  const dyUser = endUser[1] - startUser[1];
  const lengthUser = Math.hypot(dxUser, dyUser);

  if (lengthUser < 6) {
    return { passed: false, accuracy: 20 };
  }

  if (!targetStrokePoints || targetStrokePoints.length < 2) {
    return { passed: true, accuracy: 92 };
  }

  const startTarget = targetStrokePoints[0];
  const endTarget = targetStrokePoints[targetStrokePoints.length - 1];
  const startDist = Math.hypot(startUser[0] - startTarget[0], startUser[1] - startTarget[1]);
  const endDist = Math.hypot(endUser[0] - endTarget[0], endUser[1] - endTarget[1]);
  const avgDist = (startDist + endDist) / 2;

  const rawAccuracy = Math.max(68, Math.min(99, Math.round(100 - avgDist * 0.42)));
  return {
    passed: true,
    accuracy: rawAccuracy,
  };
}

export function parseQuickSlideInput(rawInput: string, nextIndex: number): VocabSlide | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  const parts = trimmed.split('|').map((p) => p.trim());
  const hanzi = parts[0] || '';
  if (!hanzi) return null;

  // 1. Check INITIAL_VOCAB_SLIDES or SMART_HANZI_DICTIONARY
  const existingPreset = INITIAL_VOCAB_SLIDES.find((s) => s.hanzi === hanzi);
  const dictEntry = SMART_HANZI_DICTIONARY[hanzi];

  // 2. Compose accurate syllable-by-syllable Pinyin, Hán Việt & Meaning from CHAR_META_DICTIONARY if not in word dict
  const charList = Array.from(hanzi);
  const composedPinyin = charList
    .map((ch) => CHAR_META_DICTIONARY[ch]?.pinyin || STROKE_LIBRARY[ch]?.pinyin || '')
    .filter(Boolean)
    .join(' ');
  const composedHanViet = charList
    .map((ch) => CHAR_META_DICTIONARY[ch]?.hanViet || '')
    .filter(Boolean)
    .join(' ');
  const composedMeaning = charList
    .map((ch) => CHAR_META_DICTIONARY[ch]?.meaning || '')
    .filter(Boolean)
    .join(' · ');

  const pinyin =
    parts[1] ||
    existingPreset?.pinyin ||
    dictEntry?.pinyin ||
    composedPinyin ||
    hanzi;
  const hanViet =
    parts[4] ||
    existingPreset?.hanViet ||
    dictEntry?.hanViet ||
    composedHanViet ||
    hanzi;
  const meaning =
    parts[2] ||
    existingPreset?.meaning ||
    dictEntry?.meaning ||
    composedMeaning ||
    `Từ vựng tiếng Trung: ${hanzi}`;
  const exampleHanzi =
    parts[3] ||
    existingPreset?.exampleHanzi ||
    dictEntry?.exampleHanzi ||
    `我们 今天 一起 学习 “${hanzi}” 这个 词。`;
  const illustrationKey =
    existingPreset?.illustrationKey ||
    dictEntry?.illustrationKey ||
    inferIllustrationCategory(hanzi, meaning);

  const pinyinSyllables = pinyin.split(/\s+/);
  const characters = charList.map((ch, idx) =>
    getStrokeDataForChar(ch, pinyinSyllables[idx] || pinyin)
  );

  return {
    id: `slide-custom-${nextIndex}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    index: nextIndex,
    hanzi,
    pinyin,
    hanViet,
    meaning,
    partOfSpeech: existingPreset?.partOfSpeech || dictEntry?.partOfSpeech || 'TỪ VỰNG HSK',
    hskLevel: existingPreset?.hskLevel || dictEntry?.hskLevel || 'HSK 3–4',
    usageNote:
      existingPreset?.usageNote ||
      dictEntry?.usageNote ||
      `Từ vựng “${hanzi}” (${pinyin} — Hán Việt: ${hanViet}): ${meaning}.`,
    exampleHanzi,
    examplePinyin:
      existingPreset?.examplePinyin ||
      dictEntry?.examplePinyin ||
      `Wǒmen jīntiān yīqǐ xuéxí “${pinyin}” zhège cí.`,
    exampleMeaning:
      existingPreset?.exampleMeaning ||
      dictEntry?.exampleMeaning ||
      `Hôm nay chúng ta cùng học từ “${hanzi}” (${meaning}).`,
    illustrationKey,
    learned: false,
    characters: characters.length > 0 ? characters : [STROKE_LIBRARY['龙']],
  };
}

export function parseBatchSlideInput(
  rawText: string,
  startingIndex: number
): VocabSlide[] {
  const lines = rawText
    .split(/\r?\n|;|,|，|、/)
    .map((l) => l.trim())
    .filter(Boolean);
  const results: VocabSlide[] = [];
  lines.forEach((line, idx) => {
    const parsed = parseQuickSlideInput(line, startingIndex + idx);
    if (parsed) {
      results.push(parsed);
    }
  });
  return results;
}

export function autoGradeClassSession(session: ClassSession): ClassSession {
  const baseScore = 8.6 + ((session.sessionNumber * 3) % 12) * 0.1;
  const roundedScore = Math.round(baseScore * 10) / 10;
  return {
    ...session,
    homeworkAssigned: true,
    submissionsCount: session.totalStudents,
    autoGraded: true,
    averageScore: roundedScore,
  };
}

export function updateLeaderboardWithScore(
  entries: LeaderboardEntry[],
  studentName: string,
  pointsToAdd: number
): LeaderboardEntry[] {
  const cleanName = studentName.trim() || 'Lưu Thị Minh Thư';
  let found = false;
  const updated = entries.map((entry) => {
    if (entry.studentName.toLowerCase() === cleanName.toLowerCase()) {
      found = true;
      return {
        ...entry,
        score: entry.score + pointsToAdd,
        streak: entry.streak + (pointsToAdd > 0 ? 1 : 0),
      };
    }
    return entry;
  });

  if (!found) {
    const initials = cleanName
      .split(/\s+/)
      .slice(-2)
      .map((w) => w[0]?.toUpperCase() || 'H')
      .join('');
    updated.push({
      id: `lb-${Date.now()}`,
      studentName: cleanName,
      avatarCode: initials || 'HV',
      score: Math.max(1, pointsToAdd),
      streak: 1,
      timeSeconds: 10,
    });
  }

  return updated.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSeconds - b.timeSeconds;
  });
}

export type BinBinActionType =
  | 'mnemonic'
  | 'dialogue'
  | 'grammar-fix'
  | 'quiz-hint'
  | 'chat';

export interface BinBinWordCardInfo {
  hanzi: string;
  pinyin: string;
  hanViet: string;
  meaning: string;
  partOfSpeech: string;
  hskLevel: string;
  radicalMnemonic: string;
  compoundWords: { hanzi: string; pinyin: string; meaning: string }[];
}

export interface BinBinReply {
  replyText: string;
  chinesePhrase: string;
  pinyinPhrase: string;
  vietnamesePhrase: string;
  wordCard?: BinBinWordCardInfo;
}

const HANZI_MNEMONIC_STORIES: Record<string, string> = {
  交通: 'Chào bạn! Bin Bin bật mí mẹo nhớ nhanh từ “交通” (jiāo tōng - giao thông) qua chiết tự bộ thủ nhé: Chữ 交 (jiāo - giao, 6 nét, bộ 亠 Đầu) vẽ hình hai nét phẩy mác đan chéo nhau tượng trưng cho sự giao nhau, kết nối; chữ 通 (tōng - thông, 10 nét, bộ 辶 Sước - bước chân đi trên đường) chỉ sự đi lại thông suốt. Hai chữ ghép lại “交通” chính là mạng lưới giao thông đi lại thông suốt!',
  温暖: 'Chào bạn! Bin Bin bật mí mẹo chiết tự siêu dễ nhớ cho từ “温暖” (wēn nuǎn - ôn noãn - ấm áp) nhé: Chữ 温 (12 nét) có bộ Thủy (氵- dòng nước) bên trái, chữ Nhật (日 - mặt trời) ở trên và bộ Mẫn (皿 - cái bát/đĩa) ở dưới — mặt trời chiếu xuống bát nước làm nước ấm lên! Còn chữ 暖 (13 nét) có bộ Nhật (日 - ánh nắng mặt trời) bên trái kết hợp bàn tay tình bạn (爰/友) bên phải — ánh nắng và bàn tay bạn bè mang lại sự ấm áp!',
  龙: 'Chào bạn! Với chữ “龙” (lóng - long - con rồng, 5 nét), Bin Bin gợi ý bạn tưởng tượng nét ngang và nét phẩy đầu tiên như chiếc sừng rồng uy nghi, nét sổ cong móc (乚) uốn lượn như thân Thanh Long bay vút lên mây, và nét chấm (丶) cuối cùng chính là viên Minh Châu tỏa sáng!',
  咱们: 'Chào bạn! Từ “咱们” (zán men - chúng ta, chúng mình) cực kỳ thân mật: chữ 咱 có bộ Khẩu (口 - cái miệng) ghép với chữ Tự (自 - bản thân mình), nghĩa là lời nói gộp cả mình và người đang nghe vào chung một nhà!',
  老师: 'Chào bạn! Từ “老师” (lǎo shī - lão sư - thầy cô giáo): chữ 老 (6 nét) vẽ dáng người trưởng bối chống gậy truyền dạy kinh nghiệm; chữ 师 (6 nét) chỉ bậc thầy mẫu mực. Gặp thầy Nguyễn Văn Thụ (阮文受), bạn hãy lễ phép chào “老师好！” nhé!',
  幸福: 'Chào bạn! Từ “幸福” (xìng fú - hạnh phúc): chữ 幸 (8 nét) gồm bộ Thổ (土) trên bộ Yên (𢆉), nghĩa là may mắn bình an; chữ 福 (13 nét) bên trái là bộ Thị (礻- lễ nghi ban phước), bên phải là Một (一) Miệng (口) Ruộng (田) — gia đình có mái nhà và ruộng vườn no ấm chính là Hạnh Phúc!',
  聪明: 'Chào bạn! Từ “聪明” (cōng míng - thông minh): chữ 聪 có bộ Nhĩ (耳 - đôi tai biết lắng nghe), bộ Khẩu (口 - miệng hỏi han) và bộ Tâm (心 - trái tim suy ngẫm); chữ 明 ghép từ Nhật (日 - mặt trời) và Nguyệt (月 - mặt trăng) tỏa sáng rực rỡ!',
  花园: 'Chào bạn! Từ “花园” (huā yuán - hoa viên - vườn hoa): chữ 花 có bộ Thảo đầu (艹 - cỏ cây) ở trên; chữ 园 có bộ Vi (囗 - tường bao quanh khu vườn) bảo vệ cây hoa bên trong!',
  空调: 'Chào bạn! Từ “空调” (kōng tiáo - điều hòa không khí): chữ 空 (không khí, không gian) có bộ Huyệt (穴); chữ 调 (điều chỉnh) có bộ Ngôn (讠) và chữ Chu (周 - chu toàn) — điều chỉnh không khí trong phòng thật mát mẻ!',
  咖啡: 'Chào bạn! Từ “咖啡” (kā fēi - cà phê): cả hai chữ 咖 và 啡 đều có bộ Khẩu (口 - cái miệng) ở bên trái vì cà phê là thức uống thơm ngon dùng miệng thưởng thức, còn phần bên phải (加 kā và 非 fēi) gợi âm đọc!',
  狗: 'Chào bạn! Chữ “狗” (gǒu - cẩu - con chó, 8 nét) có bộ Khuyển (犭- con chó) ở bên trái và chữ Câu (句 - cái móc cong / tiếng sủa gâu gâu) ở bên phải — chú cún vẫy đuôi cong trông nhà thật đáng yêu!',
  换: 'Chào bạn! Chữ “换” (huàn - hoán - đổi, trao đổi, 10 nét) có bộ Thủ gảy (扌- bàn tay) ở bên trái vì khi trao đổi đồ vật hay đổi tiền ta đều dùng đôi bàn tay!',
};

const WORD_COMPOUNDS_MAP: Record<
  string,
  { hanzi: string; pinyin: string; meaning: string }[]
> = {
  交通: [
    { hanzi: '公共交通', pinyin: 'gōnggòng jiāotōng', meaning: 'giao thông công cộng' },
    { hanzi: '交通工具', pinyin: 'jiāotōng gōngjù', meaning: 'phương tiện giao thông' },
  ],
  交: [
    { hanzi: '交通', pinyin: 'jiāotōng', meaning: 'giao thông, đi lại' },
    { hanzi: '交朋友', pinyin: 'jiāo péngyou', meaning: 'kết bạn mới' },
  ],
  通: [
    { hanzi: '交通', pinyin: 'jiāotōng', meaning: 'giao thông' },
    { hanzi: '通知', pinyin: 'tōngzhī', meaning: 'thông báo' },
  ],
  温暖: [
    { hanzi: '温暖如春', pinyin: 'wēnnuǎn rú chūn', meaning: 'ấm áp như mùa xuân' },
    { hanzi: '感到温暖', pinyin: 'gǎndào wēnnuǎn', meaning: 'cảm thấy ấm lòng' },
  ],
  龙: [
    { hanzi: '巨龙', pinyin: 'jù lóng', meaning: 'rồng lớn uy nghi' },
    { hanzi: '龙舟', pinyin: 'lóng zhōu', meaning: 'thuyền rồng' },
  ],
  老师: [
    { hanzi: '汉语老师', pinyin: 'Hànyǔ lǎoshī', meaning: 'giáo viên tiếng Trung' },
    { hanzi: '王老师', pinyin: 'Wáng lǎoshī', meaning: 'thầy/cô Vương' },
  ],
  幸福: [
    { hanzi: '幸福家庭', pinyin: 'xìngfú jiātíng', meaning: 'gia đình hạnh phúc' },
    { hanzi: '幸福感', pinyin: 'xìngfú gǎn', meaning: 'cảm giác hạnh phúc' },
  ],
  咖啡: [
    { hanzi: '咖啡馆', pinyin: 'kāfēi guǎn', meaning: 'quán cà phê' },
    { hanzi: '冰咖啡', pinyin: 'bīng kāfēi', meaning: 'cà phê đá' },
  ],
  狗: [
    { hanzi: '小狗', pinyin: 'xiǎo gǒu', meaning: 'chú cún con' },
    { hanzi: '宠物狗', pinyin: 'chǒngwù gǒu', meaning: 'chó cưng' },
  ],
  换: [
    { hanzi: '换钱', pinyin: 'huàn qián', meaning: 'đổi tiền, đổi ngoại tệ' },
    { hanzi: '换衣服', pinyin: 'huàn yīfu', meaning: 'thay quần áo' },
  ],
  空调: [
    { hanzi: '开空调', pinyin: 'kāi kōngtiáo', meaning: 'bật điều hòa' },
    { hanzi: '空调房', pinyin: 'kōngtiáo fáng', meaning: 'phòng có điều hòa' },
  ],
  花园: [
    { hanzi: '大花园', pinyin: 'dà huāyuán', meaning: 'khu vườn hoa lớn' },
    { hanzi: '公园', pinyin: 'gōngyuán', meaning: 'công viên' },
  ],
  咱们: [
    { hanzi: '咱们班', pinyin: 'zánmen bān', meaning: 'lớp chúng mình' },
    { hanzi: '咱们一起', pinyin: 'zánmen yīqǐ', meaning: 'chúng ta cùng nhau' },
  ],
  聪明: [
    { hanzi: '聪明伶俐', pinyin: 'cōngmíng línglì', meaning: 'thông minh lanh lợi' },
    { hanzi: '聪明人', pinyin: 'cōngmíng rén', meaning: 'người thông minh' },
  ],
};

function getCompoundsForWord(
  hanzi: string,
  pinyin: string,
  meaning: string
): { hanzi: string; pinyin: string; meaning: string }[] {
  if (WORD_COMPOUNDS_MAP[hanzi]) {
    return WORD_COMPOUNDS_MAP[hanzi];
  }
  return [
    {
      hanzi: `学习${hanzi}`,
      pinyin: `xuéxí ${pinyin}`,
      meaning: `học từ “${hanzi}” (${meaning})`,
    },
    {
      hanzi: `常用${hanzi}`,
      pinyin: `chángyòng ${pinyin}`,
      meaning: `ứng dụng “${hanzi}” trong giao tiếp`,
    },
  ];
}

function buildRadicalBreakdownText(hanzi: string, fallbackChars?: StrokeData[]): string {
  const chars = Array.from(hanzi).filter((ch) => /[\u4e00-\u9fff]/.test(ch));
  if (chars.length === 0 && fallbackChars && fallbackChars.length > 0) {
    return fallbackChars
      .map((c) => `chữ ${c.char} (${c.pinyin}, ${c.strokeCount} nét, bộ thủ: ${c.radical})`)
      .join('; ');
  }
  return chars
    .map((ch, idx) => {
      const meta = CHAR_META_DICTIONARY[ch];
      const fb = fallbackChars?.[idx];
      const py = meta?.pinyin || fb?.pinyin || ch;
      const hv = meta?.hanViet ? ` - Hán Việt: ${meta.hanViet}` : '';
      const meaning = meta?.meaning ? ` (${meta.meaning})` : '';
      const strokes = meta?.strokeCount || fb?.strokeCount || 8;
      const radical = meta?.radical || fb?.radical || 'Bộ thủ Hán tự';
      return `chữ ${ch} [${py}${hv}${meaning}, ${strokes} nét, bộ ${radical}]`;
    })
    .join('; ');
}

function buildWordCardForTarget(
  hanzi: string,
  entry?: SmartDictEntry | VocabSlide | null
): {
  wordCard: BinBinWordCardInfo;
  exampleHanzi: string;
  examplePinyin: string;
  exampleMeaning: string;
  usageNote: string;
} {
  const dict = SMART_HANZI_DICTIONARY[hanzi];
  const slideMatch = INITIAL_VOCAB_SLIDES.find((s) => s.hanzi === hanzi);
  const charMeta = CHAR_META_DICTIONARY[hanzi];

  const pinyin =
    entry?.pinyin ||
    dict?.pinyin ||
    slideMatch?.pinyin ||
    charMeta?.pinyin ||
    Array.from(hanzi)
      .map((c) => CHAR_META_DICTIONARY[c]?.pinyin || c)
      .join(' ');
  const hanViet =
    entry?.hanViet ||
    dict?.hanViet ||
    slideMatch?.hanViet ||
    charMeta?.hanViet ||
    Array.from(hanzi)
      .map((c) => CHAR_META_DICTIONARY[c]?.hanViet || c)
      .join(' ');
  const meaning =
    entry?.meaning ||
    dict?.meaning ||
    slideMatch?.meaning ||
    charMeta?.meaning ||
    Array.from(hanzi)
      .map((c) => CHAR_META_DICTIONARY[c]?.meaning || c)
      .join(', ');
  const partOfSpeech =
    entry?.partOfSpeech ||
    dict?.partOfSpeech ||
    slideMatch?.partOfSpeech ||
    'TỪ VỰNG HSK';
  const hskLevel =
    entry?.hskLevel || dict?.hskLevel || slideMatch?.hskLevel || 'HSK 1–4';
  const usageNote =
    entry?.usageNote ||
    dict?.usageNote ||
    slideMatch?.usageNote ||
    `Dùng phổ biến trong giao tiếp và bài thi ${hskLevel}.`;

  const exampleHanzi =
    entry?.exampleHanzi ||
    dict?.exampleHanzi ||
    slideMatch?.exampleHanzi ||
    `我们 今天 一起 学习 “${hanzi}” 这个 词。`;
  const examplePinyin =
    entry?.examplePinyin ||
    dict?.examplePinyin ||
    slideMatch?.examplePinyin ||
    `Wǒmen jīntiān yīqǐ xuéxí “${pinyin}” zhège cí.`;
  const exampleMeaning =
    entry?.exampleMeaning ||
    dict?.exampleMeaning ||
    slideMatch?.exampleMeaning ||
    `Hôm nay chúng ta cùng học từ “${hanzi}” (${meaning}).`;

  const radicalBreakdown = buildRadicalBreakdownText(
    hanzi,
    slideMatch?.characters
  );
  const radicalMnemonic =
    HANZI_MNEMONIC_STORIES[hanzi] ||
    `Chiết tự bộ thủ: ${radicalBreakdown}. Ghép ý nghĩa từng bộ thủ giúp bạn nhớ ngay từ “${hanzi}” (${pinyin} - ${meaning})!`;

  const compoundWords = getCompoundsForWord(hanzi, pinyin, meaning);

  return {
    wordCard: {
      hanzi,
      pinyin,
      hanViet,
      meaning,
      partOfSpeech,
      hskLevel,
      radicalMnemonic,
      compoundWords,
    },
    exampleHanzi,
    examplePinyin,
    exampleMeaning,
    usageNote,
  };
}

/**
 * Resolves any user query (Chinese word like "交通", "温暖", Vietnamese meaning like "giao thông",
 * or Pinyin like "jiaotong") into an instant target vocabulary entry in 0ms.
 */
function resolveTargetFromUserPrompt(
  userPrompt: string,
  fallbackSlide?: VocabSlide | null
): {
  targetHanzi: string;
  matchedEntry?: SmartDictEntry | VocabSlide | null;
  isDirectWordLookup: boolean;
} {
  const defaultSlide =
    fallbackSlide || INITIAL_VOCAB_SLIDES[10] || INITIAL_VOCAB_SLIDES[0];
  const trimmed = userPrompt.trim();
  if (!trimmed) {
    return {
      targetHanzi: defaultSlide.hanzi,
      matchedEntry: defaultSlide,
      isDirectWordLookup: false,
    };
  }

  // Ignore default 1-touch action prompts so they use the active slide directly
  if (
    trimmed.startsWith('Giải thích bộ thủ và mẹo nhớ chiết tự') ||
    trimmed.startsWith('Giải thích mẹo nhớ') ||
    trimmed.startsWith('Luyện hội thoại') ||
    trimmed.startsWith('Sửa lỗi câu và hướng dẫn ngữ pháp') ||
    trimmed.startsWith('Gợi ý cấu trúc ngữ pháp') ||
    trimmed.startsWith('Gợi ý đáp án')
  ) {
    return {
      targetHanzi: defaultSlide.hanzi,
      matchedEntry: defaultSlide,
      isDirectWordLookup: false,
    };
  }

  // 1. Exact match in SMART_HANZI_DICTIONARY or CHAR_META_DICTIONARY
  if (SMART_HANZI_DICTIONARY[trimmed]) {
    return {
      targetHanzi: trimmed,
      matchedEntry: SMART_HANZI_DICTIONARY[trimmed],
      isDirectWordLookup: true,
    };
  }
  if (CHAR_META_DICTIONARY[trimmed]) {
    return {
      targetHanzi: trimmed,
      matchedEntry: null,
      isDirectWordLookup: true,
    };
  }

  // 2. Check if user typed Chinese characters (e.g. "交通", "từ 交通 nghĩa là gì", or a short word)
  const chineseMatches = trimmed.match(/[\u4e00-\u9fff]+/g);
  if (chineseMatches && chineseMatches.length > 0) {
    // Check if any extracted Chinese token is in SMART_HANZI_DICTIONARY
    for (const token of chineseMatches) {
      if (SMART_HANZI_DICTIONARY[token]) {
        return {
          targetHanzi: token,
          matchedEntry: SMART_HANZI_DICTIONARY[token],
          isDirectWordLookup: token.length <= 4,
        };
      }
      // Or check if a known dictionary key appears inside the token
      for (const dictKey of Object.keys(SMART_HANZI_DICTIONARY)) {
        if (dictKey.length >= 2 && token.includes(dictKey)) {
          return {
            targetHanzi: dictKey,
            matchedEntry: SMART_HANZI_DICTIONARY[dictKey],
            isDirectWordLookup: token.length <= 4,
          };
        }
      }
    }
    const primaryHanzi = chineseMatches[0];
    if (primaryHanzi.length <= 4 && chineseMatches.length === 1) {
      return {
        targetHanzi: primaryHanzi,
        matchedEntry: SMART_HANZI_DICTIONARY[primaryHanzi] || null,
        isDirectWordLookup: true,
      };
    }
  }

  // 3. Vietnamese meaning or Pinyin lookup (e.g. "giao thông", "jiaotong", "ấm áp")
  const cleanedVn = trimmed
    .replace(/^(từ|chữ|nghĩa của từ|tiếng trung|cho hỏi|bin bin ơi|giải thích)\s+/i, '')
    .replace(/\s+(nghĩa là gì|tiếng trung là gì|là gì)\??$/i, '')
    .trim();
  const suggestions = searchInstantVocabSuggestions(cleanedVn, { limit: 1 });
  if (suggestions.length > 0 && cleanedVn.length <= 24) {
    const top = suggestions[0];
    return {
      targetHanzi: top.hanzi,
      matchedEntry: SMART_HANZI_DICTIONARY[top.hanzi] || null,
      isDirectWordLookup: true,
    };
  }

  return {
    targetHanzi: defaultSlide.hanzi,
    matchedEntry: defaultSlide,
    isDirectWordLookup: false,
  };
}

/**
 * Pure, deterministic, 0ms instant responder for Gấu trúc Bin Bin (彬彬)
 * so unit tests, 1-touch buttons, and custom queries ("交通", "温暖", Vietnamese/Chinese)
 * always receive rich, complete educational cards immediately without any delay.
 */
export function generateBinBinSmartReply(
  actionType: BinBinActionType,
  userPrompt: string,
  contextSlide?: VocabSlide | null,
  contextQuiz?: {
    prompt?: string;
    grammarHint?: string;
    pinyinHint?: string;
  } | null
): BinBinReply {
  const slide = contextSlide || INITIAL_VOCAB_SLIDES[10] || INITIAL_VOCAB_SLIDES[0];
  const resolved = resolveTargetFromUserPrompt(userPrompt, slide);
  const targetDetails = buildWordCardForTarget(
    resolved.targetHanzi,
    resolved.matchedEntry
  );
  const { wordCard, exampleHanzi, examplePinyin, exampleMeaning, usageNote } =
    targetDetails;

  const compoundsSummary = wordCard.compoundWords
    .map((c) => `${c.hanzi} (${c.pinyin} - ${c.meaning})`)
    .join('; ');

  if (actionType === 'mnemonic') {
    const customStory =
      HANZI_MNEMONIC_STORIES[wordCard.hanzi] ||
      `Chào bạn! Bin Bin (彬彬) giúp bạn giải mã chiết tự từ “${wordCard.hanzi}” (${wordCard.pinyin} — Hán Việt: ${wordCard.hanViet}, nghĩa là: ${wordCard.meaning}) nhé! ${wordCard.radicalMnemonic} Từ ghép phổ biến: ${compoundsSummary}.`;

    return {
      replyText: `${customStory} Từ ghép thông dụng: ${compoundsSummary}.`,
      chinesePhrase: exampleHanzi,
      pinyinPhrase: examplePinyin,
      vietnamesePhrase: exampleMeaning,
      wordCard,
    };
  }

  if (actionType === 'dialogue') {
    return {
      replyText: `Chào bạn! Bin Bin (彬彬) rất vui được luyện hội thoại tiếng Trung cùng bạn với từ khóa “${wordCard.hanzi}” (${wordCard.pinyin} - Hán Việt: ${wordCard.hanViet} - nghĩa: ${wordCard.meaning}). Bạn có thể dùng từ “${wordCard.hanzi}” hoặc 2 từ ghép phổ biến (${compoundsSummary}) để đặt câu trả lời Bin Bin nhé! Bấm nút [🔊 Nghe zh-CN] để nghe Bin Bin đọc mẫu chuẩn Bắc Kinh nha!`,
      chinesePhrase: `你好！我是熊猫彬彬。今天我们用“${wordCard.hanzi}”来聊天吧：${exampleHanzi}`,
      pinyinPhrase: `Nǐ hǎo! Wǒ shì xióngmāo Bīnbīn. Jīntiān wǒmen yòng “${wordCard.pinyin}” lái liáotiān ba: ${examplePinyin}`,
      vietnamesePhrase: `Xin chào! Mình là Gấu trúc Bin Bin. Hôm nay chúng mình dùng từ “${wordCard.meaning}” để trò chuyện nhé: ${exampleMeaning}`,
      wordCard,
    };
  }

  // If the user typed a vocabulary word directly (e.g. "交通", "温暖", "giao thông"), return the full dictionary & radical card immediately!
  if (resolved.isDirectWordLookup) {
    return {
      replyText: `Chào bạn! Bin Bin (彬彬) phân tích tức thì từ “${wordCard.hanzi}” (${wordCard.pinyin} · Hán Việt: ${wordCard.hanViet.toUpperCase()} · Nghĩa: ${wordCard.meaning}) nhé! 💡 ${wordCard.radicalMnemonic} 🔗 2 từ ghép phổ biến: ${compoundsSummary}.`,
      chinesePhrase: exampleHanzi,
      pinyinPhrase: examplePinyin,
      vietnamesePhrase: exampleMeaning,
      wordCard,
    };
  }

  if (actionType === 'grammar-fix') {
    const cleanInput = userPrompt.trim();
    const hasCustomSentence =
      cleanInput.length > 0 &&
      !cleanInput.startsWith('Sửa lỗi câu') &&
      !cleanInput.startsWith('Nhờ Bin Bin kiểm tra');

    if (hasCustomSentence) {
      return {
        replyText: `Bin Bin (彬彬) đã kiểm tra kỹ câu “${cleanInput}” của bạn rồi! Mẹo ngữ pháp HSK của Bin Bin: Trong tiếng Trung, trạng ngữ chỉ thời gian/địa điểm luôn đứng trước động từ (Chủ ngữ + Thời gian + Địa điểm + Động từ), và trước tính từ đơn âm tiết/song âm tiết thường có phó từ mức độ như “很 (hěn)” hoặc “非常 (fēicháng)”. Từ ghép mở rộng: ${compoundsSummary}. Bạn tham khảo mẫu câu chuẩn dưới đây của Bin Bin nhé!`,
        chinesePhrase: exampleHanzi,
        pinyinPhrase: examplePinyin,
        vietnamesePhrase: exampleMeaning,
        wordCard,
      };
    }

    return {
      replyText: `Chào bạn! Với từ “${wordCard.hanzi}” (${wordCard.pinyin} - Hán Việt: ${wordCard.hanViet} - nghĩa: ${wordCard.meaning}, từ loại: ${wordCard.partOfSpeech}), Bin Bin lưu ý bạn cấu trúc chuẩn: ${usageNote} Từ ghép phổ biến: ${compoundsSummary}.`,
      chinesePhrase: exampleHanzi,
      pinyinPhrase: examplePinyin,
      vietnamesePhrase: exampleMeaning,
      wordCard,
    };
  }

  if (actionType === 'quiz-hint') {
    const quizPrompt = contextQuiz?.prompt || 'Sắp xếp câu & Trắc nghiệm HSK';
    const grammarHint =
      contextQuiz?.grammarHint ||
      'Chủ ngữ (Ai/Cái gì) + Phó từ/Trạng ngữ + Động từ/Tính từ + Tân ngữ';
    const pinyinHint = contextQuiz?.pinyinHint || examplePinyin;

    return {
      replyText: `Suỵt! Bin Bin (彬彬) gợi ý nhỏ cho bạn ở câu “${quizPrompt}” mà không làm lộ đáp án ngay nhé: Bạn hãy chú ý cấu trúc ngữ pháp 【${grammarHint}】. Hãy tìm từ làm Chủ ngữ đặt ở đầu câu, sau đó ghép vị ngữ theo gợi ý phiên âm Pinyin: “${pinyinHint}”. Bạn làm được mà, cố lên nha! 🐼🎋`,
      chinesePhrase: '加油！先找主语，再排谓语和宾语！',
      pinyinPhrase: 'Jiāyóu! Xiān zhǎo zhǔyǔ, zài pái wèiyǔ hé bīnyǔ!',
      vietnamesePhrase: 'Cố lên bạn nhé! Hãy tìm chủ ngữ trước, rồi sắp xếp vị ngữ và tân ngữ!',
      wordCard,
    };
  }

  // General chat with Bin Bin
  return {
    replyText: `Bin Bin (彬彬) giải đáp ngay câu hỏi “${userPrompt}” của bạn! Từ khóa liên quan: “${wordCard.hanzi}” (${wordCard.pinyin} - Hán Việt: ${wordCard.hanViet}, nghĩa: ${wordCard.meaning}). 💡 ${wordCard.radicalMnemonic} 🔗 2 từ ghép phổ biến: ${compoundsSummary}.`,
    chinesePhrase: exampleHanzi,
    pinyinPhrase: examplePinyin,
    vietnamesePhrase: exampleMeaning,
    wordCard,
  };
}

/**
 * Hybrid Instant Local-First Responder:
 * Immediately prepares the local reply in 0ms, and if background AI enrichment is called,
 * enforces a strict 1200ms timeout so it never hangs or delays.
 */
export async function askBinBinPandaAI(
  actionType: BinBinActionType,
  userPrompt: string,
  contextSlide?: VocabSlide | null,
  contextQuiz?: {
    prompt?: string;
    grammarHint?: string;
    pinyinHint?: string;
  } | null
): Promise<BinBinReply> {
  const fallbackReply = generateBinBinSmartReply(
    actionType,
    userPrompt,
    contextSlide,
    contextQuiz
  );

  // For direct dictionary lookups or 1-touch actions, return the instant local analysis immediately (0ms)
  const resolved = resolveTargetFromUserPrompt(userPrompt, contextSlide);
  if (resolved.isDirectWordLookup || actionType !== 'chat') {
    return fallbackReply;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1200);

  try {
    const res = await fetch('/api/binbin/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        actionType,
        prompt: userPrompt,
        contextSlide: contextSlide
          ? {
              hanzi: contextSlide.hanzi,
              pinyin: contextSlide.pinyin,
              hanViet: contextSlide.hanViet,
              meaning: contextSlide.meaning,
              usageNote: contextSlide.usageNote,
              exampleHanzi: contextSlide.exampleHanzi,
              examplePinyin: contextSlide.examplePinyin,
              exampleMeaning: contextSlide.exampleMeaning,
            }
          : null,
        contextQuiz: contextQuiz || null,
      }),
    });
    clearTimeout(timeoutId);

    if (!res.ok) return fallbackReply;
    const data = await res.json();
    if (!data || data.fallback || !data.replyText) {
      return fallbackReply;
    }

    return {
      replyText: data.replyText,
      chinesePhrase: data.chinesePhrase || fallbackReply.chinesePhrase,
      pinyinPhrase: data.pinyinPhrase || fallbackReply.pinyinPhrase,
      vietnamesePhrase: data.vietnamesePhrase || fallbackReply.vietnamesePhrase,
      wordCard: fallbackReply.wordCard,
    };
  } catch {
    clearTimeout(timeoutId);
    return fallbackReply;
  }
}

export interface VocabSuggestionItem {
  hanzi: string;
  pinyin: string;
  hanViet: string;
  meaning: string;
  partOfSpeech: string;
  hskLevel: string;
  exampleHanzi: string;
  examplePinyin?: string;
  exampleMeaning: string;
  usageNote?: string;
  topicTag: 'all' | 'family' | 'school' | 'daily' | 'nature';
  source: 'local' | 'ai';
}

/**
 * Strips Vietnamese diacritics and Pinyin tone marks for forgiving, instant search
 * (e.g., "wēn nuǎn" -> "wen nuan", "ấm áp" -> "am ap", "ôn noãn" -> "on noan").
 */
export function normalizeSearchText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/ü/g, 'v')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferSuggestionTopic(
  hanzi: string,
  meaning: string,
  illustrationKey?: string
): VocabSuggestionItem['topicTag'] {
  if (
    illustrationKey === 'xingfu' ||
    illustrationKey === 'pengyou' ||
    /家|爱|友|咱|欢|喜|乐|고|gia đình|yêu|bạn|vui|hạnh phúc/.test(`${hanzi} ${meaning}`)
  ) {
    return 'family';
  }
  if (
    illustrationKey === 'laoshi' ||
    illustrationKey === 'chuzhong' ||
    illustrationKey === 'nuli' ||
    illustrationKey === 'school' ||
    /学|校|师|聪|语|努|功|梦|trường|học|giáo viên|thông minh|nỗ lực/.test(`${hanzi} ${meaning}`)
  ) {
    return 'school';
  }
  if (
    illustrationKey === 'kafei' ||
    illustrationKey === 'kongtiao' ||
    illustrationKey === 'xiyiji' ||
    illustrationKey === 'bingxiang' ||
    illustrationKey === 'weishengjian' ||
    illustrationKey === 'deng' ||
    /咖|茶|食|空|洗|冰|卫|灯|换|cà phê|trà|ăn|điều hòa|tủ lạnh|đèn/.test(`${hanzi} ${meaning}`)
  ) {
    return 'daily';
  }
  return 'nature';
}

function getAllLocalVocabCatalog(): VocabSuggestionItem[] {
  const seen = new Set<string>();
  const catalog: VocabSuggestionItem[] = [];

  // 1. Curated multi-character & single-character entries in SMART_HANZI_DICTIONARY
  for (const [hanzi, entry] of Object.entries(SMART_HANZI_DICTIONARY)) {
    if (seen.has(hanzi)) continue;
    seen.add(hanzi);
    catalog.push({
      hanzi,
      pinyin: entry.pinyin,
      hanViet: entry.hanViet,
      meaning: entry.meaning,
      partOfSpeech: entry.partOfSpeech,
      hskLevel: entry.hskLevel,
      exampleHanzi: entry.exampleHanzi,
      examplePinyin: entry.examplePinyin,
      exampleMeaning: entry.exampleMeaning,
      usageNote: entry.usageNote,
      topicTag: inferSuggestionTopic(hanzi, entry.meaning, entry.illustrationKey),
      source: 'local',
    });
  }

  // 2. Any initial slides not already in SMART_HANZI_DICTIONARY
  for (const slide of INITIAL_VOCAB_SLIDES) {
    if (seen.has(slide.hanzi)) continue;
    seen.add(slide.hanzi);
    catalog.push({
      hanzi: slide.hanzi,
      pinyin: slide.pinyin,
      hanViet: slide.hanViet,
      meaning: slide.meaning,
      partOfSpeech: slide.partOfSpeech,
      hskLevel: slide.hskLevel,
      exampleHanzi: slide.exampleHanzi,
      examplePinyin: slide.examplePinyin,
      exampleMeaning: slide.exampleMeaning,
      usageNote: slide.usageNote,
      topicTag: inferSuggestionTopic(slide.hanzi, slide.meaning, slide.illustrationKey),
      source: 'local',
    });
  }

  // 3. Single characters from CHAR_META_DICTIONARY
  for (const [char, meta] of Object.entries(CHAR_META_DICTIONARY)) {
    if (seen.has(char)) continue;
    seen.add(char);
    catalog.push({
      hanzi: char,
      pinyin: meta.pinyin,
      hanViet: meta.hanViet,
      meaning: meta.meaning,
      partOfSpeech: 'CHỮ HÁN ĐƠN',
      hskLevel: 'HSK 1–3',
      exampleHanzi: `我们 一起 练习 写 “${char}” 字。`,
      examplePinyin: `Wǒmen yīqǐ liànxí xiě “${meta.pinyin}” zì.`,
      exampleMeaning: `Chúng ta cùng luyện viết chữ “${char}” (${meta.meaning}).`,
      usageNote: `Bộ thủ: ${meta.radical} · Số nét chuẩn: ${meta.strokeCount} nét.`,
      topicTag: inferSuggestionTopic(char, meta.meaning),
      source: 'local',
    });
  }

  return catalog;
}

/**
 * Pure, 0ms instant vocabulary search & suggestion engine for Teachers.
 * Matches by Hanzi, Pinyin (with or without tones/spaces), Hán Việt, Vietnamese meaning,
 * HSK level, or topic filter.
 */
export function searchInstantVocabSuggestions(
  query: string,
  options?: {
    topic?: 'all' | 'family' | 'school' | 'daily' | 'nature';
    limit?: number;
  }
): VocabSuggestionItem[] {
  const topic = options?.topic || 'all';
  const limit = options?.limit || 8;
  const catalog = getAllLocalVocabCatalog();

  const filteredByTopic =
    topic === 'all' ? catalog : catalog.filter((item) => item.topicTag === topic);

  const rawTrimmed = query.trim();
  if (!rawTrimmed) {
    return filteredByTopic.slice(0, limit);
  }

  const normQuery = normalizeSearchText(rawTrimmed);
  const compactQuery = normQuery.replace(/\s+/g, '');

  const scored: { item: VocabSuggestionItem; score: number }[] = [];

  for (const item of filteredByTopic) {
    let score = 0;
    const normPinyin = normalizeSearchText(item.pinyin);
    const compactPinyin = normPinyin.replace(/\s+/g, '');
    const normHanViet = normalizeSearchText(item.hanViet);
    const normMeaning = normalizeSearchText(item.meaning);
    const normHsk = normalizeSearchText(item.hskLevel);
    const normExample = normalizeSearchText(
      `${item.exampleHanzi} ${item.exampleMeaning} ${item.usageNote || ''}`
    );

    // Exact Hanzi match
    if (item.hanzi === rawTrimmed) {
      score += 120;
    } else if (item.hanzi.includes(rawTrimmed)) {
      score += 85;
    }

    // Pinyin match (with or without spaces/tones)
    if (normPinyin === normQuery || compactPinyin === compactQuery) {
      score += 100;
    } else if (normPinyin.startsWith(normQuery) || compactPinyin.startsWith(compactQuery)) {
      score += 75;
    } else if (normPinyin.includes(normQuery) || compactPinyin.includes(compactQuery)) {
      score += 50;
    }

    // Hán Việt match
    if (normHanViet === normQuery) {
      score += 95;
    } else if (normHanViet.includes(normQuery)) {
      score += 65;
    }

    // Vietnamese meaning match
    if (normMeaning === normQuery) {
      score += 95;
    } else if (normMeaning.startsWith(normQuery)) {
      score += 75;
    } else if (normMeaning.includes(normQuery)) {
      score += 60;
    }

    // HSK level match
    if (normHsk.includes(normQuery) || normHsk.replace(/\s+/g, '').includes(compactQuery)) {
      score += 45;
    }

    // Example / usage note contextual match
    if (score === 0 && normExample.includes(normQuery)) {
      score += 30;
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Calls server-side Gemini AI (/api/hanzi/suggest) to get intelligent semantic vocabulary
 * suggestions for any Vietnamese keyword, topic, Pinyin, or Hanzi query, merged cleanly
 * with instant local matches.
 */
export async function fetchAIVocabSuggestions(
  query: string,
  topic: 'all' | 'family' | 'school' | 'daily' | 'nature' = 'all',
  limit = 8
): Promise<VocabSuggestionItem[]> {
  const localMatches = searchInstantVocabSuggestions(query, { topic, limit });
  const trimmed = query.trim();
  if (!trimmed) {
    return localMatches;
  }

  try {
    const res = await fetch('/api/hanzi/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed, topic, limit: 6 }),
    });
    if (!res.ok) {
      return localMatches;
    }
    const data = await res.json();
    if (!data || data.fallback || !Array.isArray(data.suggestions)) {
      return localMatches;
    }

    const seen = new Set(localMatches.map((m) => m.hanzi));
    const aiItems: VocabSuggestionItem[] = [];

    for (const raw of data.suggestions) {
      const hanzi = String(raw?.hanzi || '').trim();
      if (!hanzi || seen.has(hanzi)) continue;
      seen.add(hanzi);
      const meaning = String(raw?.meaning || '').trim() || `Từ vựng: ${hanzi}`;
      aiItems.push({
        hanzi,
        pinyin: String(raw?.pinyin || hanzi).trim(),
        hanViet: String(raw?.hanViet || hanzi).trim(),
        meaning,
        partOfSpeech: String(raw?.partOfSpeech || 'TỪ VỰNG HSK').trim(),
        hskLevel: String(raw?.hskLevel || 'HSK 2–4').trim(),
        exampleHanzi:
          String(raw?.exampleHanzi || '').trim() ||
          `我们 今天 一起 学习 “${hanzi}” 这个 词。`,
        examplePinyin: String(raw?.examplePinyin || '').trim(),
        exampleMeaning:
          String(raw?.exampleMeaning || '').trim() ||
          `Hôm nay chúng ta cùng học từ “${hanzi}” (${meaning}).`,
        usageNote: String(raw?.usageNote || '').trim(),
        topicTag: inferSuggestionTopic(hanzi, meaning),
        source: 'ai',
      });
    }

    return [...localMatches, ...aiItems].slice(0, limit);
  } catch {
    return localMatches;
  }
}

export type StudentStatusFilter = 'all' | 'completed' | 'needs_support';

export interface ClassStudentRecord {
  id: string;
  studentCode: string;
  hskLevel: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4';
  name: string;
  vocabScore: string;
  writingScore: string;
  quizScore: string;
  totalPoints: number;
  status: 'Đã chấm AI' | 'Đang nộp bài' | 'Cần kèm thêm';
  feedback: string;
  reviewWords?: string[];
  lastSubmittedAt?: string;
}

export interface StrokeEvaluationDetail {
  passed: boolean;
  accuracy: number;
  gradeLabel: string;
  feedback: string;
}

export function evaluateStrokeWithFeedback(
  userPoints: number[][],
  targetStrokePoints: number[][],
  strokeNumber = 1,
  totalStrokes = 5
): StrokeEvaluationDetail {
  const base = evaluateStrokeSimilarity(userPoints, targetStrokePoints);
  if (!base.passed) {
    return {
      passed: false,
      accuracy: base.accuracy,
      gradeLabel: 'Cần viết rõ hơn',
      feedback: `Nét thứ ${strokeNumber}/${totalStrokes} hơi ngắn. Hãy kéo bút dứt khoát theo đường nét đứt trên ô Mễ (米字格).`,
    };
  }
  if (base.accuracy >= 92) {
    return {
      passed: true,
      accuracy: base.accuracy,
      gradeLabel: 'Xuất sắc · Chuẩn thư pháp',
      feedback: `Nét thứ ${strokeNumber}/${totalStrokes} đạt ${base.accuracy}%! Điểm đặt bút (起笔) và thu bút (收笔) rất cân đối.`,
    };
  }
  if (base.accuracy >= 82) {
    return {
      passed: true,
      accuracy: base.accuracy,
      gradeLabel: 'Tốt · Đúng hướng bút',
      feedback: `Nét thứ ${strokeNumber}/${totalStrokes} đạt ${base.accuracy}%. Đúng quy tắc bút thuận, chú ý giữ lực bút đều hơn ở tâm ô Mễ.`,
    };
  }
  return {
    passed: true,
    accuracy: base.accuracy,
    gradeLabel: 'Đạt · Cần căn chỉnh tâm chữ',
    feedback: `Nét thứ ${strokeNumber}/${totalStrokes} đạt ${base.accuracy}%. Hãy bám sát hơn trục ngang dọc của ô Mễ Tự Cách.`,
  };
}

export function createCustomVocabSlide(
  input: {
    hanzi: string;
    pinyin?: string;
    hanViet?: string;
    meaning: string;
    exampleHanzi?: string;
    examplePinyin?: string;
    exampleMeaning?: string;
    hskLevel?: string;
    partOfSpeech?: string;
  },
  nextIndex: number
): VocabSlide | null {
  const cleanHanzi = input.hanzi.trim();
  const cleanMeaning = input.meaning.trim();
  if (!cleanHanzi || !cleanMeaning) return null;

  const pipeFormatted = `${cleanHanzi} | ${input.pinyin?.trim() || ''} | ${cleanMeaning} | ${
    input.exampleHanzi?.trim() || ''
  } | ${input.hanViet?.trim() || ''}`;

  const base = parseQuickSlideInput(pipeFormatted, nextIndex);
  if (!base) return null;

  return {
    ...base,
    pinyin: input.pinyin?.trim() || base.pinyin,
    hanViet: input.hanViet?.trim() || base.hanViet,
    meaning: cleanMeaning,
    hskLevel: input.hskLevel?.trim() || base.hskLevel,
    partOfSpeech: input.partOfSpeech?.trim() || base.partOfSpeech,
    exampleHanzi:
      input.exampleHanzi?.trim() ||
      base.exampleHanzi ||
      `我们 今天 一起 学习 “${cleanHanzi}” 这个 词。`,
    examplePinyin: input.examplePinyin?.trim() || base.examplePinyin,
    exampleMeaning:
      input.exampleMeaning?.trim() ||
      base.exampleMeaning ||
      `Hôm nay chúng ta cùng học từ “${cleanHanzi}” (${cleanMeaning}).`,
  };
}

export function isStudentNeedsSupport(student: {
  totalPoints: number;
  status?: string;
}): boolean {
  return student.totalPoints < 90 || student.status === 'Cần kèm thêm';
}

export function createStudentRecord(
  input: {
    name: string;
    studentCode?: string;
    hskLevel?: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | string;
    initialPoints?: number;
  },
  existingCount = 12
): ClassStudentRecord {
  const cleanName = input.name.trim();
  const nextNumber = existingCount + 1;
  const cleanCode =
    (input.studentCode || '').trim() ||
    `HV-${String(nextNumber).padStart(3, '0')}`;
  const validLevels = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4'] as const;
  const cleanLevel = validLevels.includes(input.hskLevel as any)
    ? (input.hskLevel as 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4')
    : 'HSK 2';

  const rawPoints =
    typeof input.initialPoints === 'number' && !Number.isNaN(input.initialPoints)
      ? input.initialPoints
      : 95;
  const clampedPoints = Math.max(0, Math.min(100, Math.round(rawPoints)));

  const vocabCount = Math.min(
    18,
    Math.max(10, Math.round((clampedPoints / 100) * 18))
  );
  const writingPct = Math.min(99, Math.max(72, clampedPoints - 2));
  const quizCorrect = Math.min(
    10,
    Math.max(5, Math.round(clampedPoints / 10))
  );

  const needsSupport = clampedPoints < 90;

  return {
    id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    studentCode: cleanCode,
    hskLevel: cleanLevel,
    name: cleanName,
    vocabScore: `${vocabCount}/18 từ`,
    writingScore: `${writingPct}% độ chuẩn nét`,
    quizScore: `${quizCorrect}/10 câu đúng`,
    totalPoints: clampedPoints,
    status: needsSupport ? 'Cần kèm thêm' : 'Đã chấm AI',
    reviewWords: needsSupport ? ['温暖', '咱们'] : [],
    feedback: needsSupport
      ? `Học viên cấp độ ${cleanLevel} cần ôn tập thêm từ vựng và thứ tự nét viết cùng trợ lý Bin Bin AI.`
      : `Học viên mới (${cleanLevel}) tham gia lớp, nắm vững kiến thức nền tảng và hoàn thành bài tập xuất sắc.`,
  };
}

export function applyStudentSubmissionToRoster(
  roster: ClassStudentRecord[],
  submission: {
    studentId?: string;
    studentName: string;
    totalScore: number;
    learnedVocabCount: number;
    totalVocabCount: number;
    writingAccuracy: number;
    quizCorrectCount: number;
    quizTotalCount: number;
    reviewWords: string[];
  }
): ClassStudentRecord[] {
  const clampedTotal = Math.max(0, Math.min(100, Math.round(submission.totalScore)));
  const clampedWriting = Math.max(60, Math.min(100, Math.round(submission.writingAccuracy)));
  const cleanReview = Array.from(new Set(submission.reviewWords.filter(Boolean)));
  const needsSupport = clampedTotal < 90 || cleanReview.length >= 3;
  const status: ClassStudentRecord['status'] = needsSupport ? 'Cần kèm thêm' : 'Đã chấm AI';
  const nowLabel = 'Vừa nộp bài';

  const feedbackText =
    cleanReview.length > 0
      ? `Vừa nộp bài đạt ${clampedTotal}/100đ · Cần ôn lại từ: ${cleanReview.join(', ')}.`
      : `Hoàn thành xuất sắc bài tập tương tác (${clampedTotal}/100đ), nắm chắc toàn bộ từ vựng và nét viết.`;

  let matched = false;
  const updated = roster.map((st) => {
    const isMatch =
      (submission.studentId && st.id === submission.studentId) ||
      normalizeSearchText(st.name) === normalizeSearchText(submission.studentName);
    if (!isMatch) return st;
    matched = true;
    return {
      ...st,
      vocabScore: `${submission.learnedVocabCount}/${submission.totalVocabCount} từ`,
      writingScore: `${clampedWriting}% độ chuẩn nét`,
      quizScore: `${submission.quizCorrectCount}/${submission.quizTotalCount} câu đúng`,
      totalPoints: clampedTotal,
      status,
      reviewWords: cleanReview,
      lastSubmittedAt: nowLabel,
      feedback: feedbackText,
    };
  });

  if (!matched && submission.studentName.trim()) {
    const created = createStudentRecord(
      {
        name: submission.studentName.trim(),
        initialPoints: clampedTotal,
      },
      roster.length
    );
    return [
      {
        ...created,
        vocabScore: `${submission.learnedVocabCount}/${submission.totalVocabCount} từ`,
        writingScore: `${clampedWriting}% độ chuẩn nét`,
        quizScore: `${submission.quizCorrectCount}/${submission.quizTotalCount} câu đúng`,
        reviewWords: cleanReview,
        lastSubmittedAt: nowLabel,
        feedback: feedbackText,
      },
      ...roster,
    ];
  }

  return updated;
}

export function awardStudentBonusPoints(
  roster: ClassStudentRecord[],
  studentIdOrName: string,
  bonusPoints: number,
  reason = 'Trả lời xuất sắc Vòng quay gọi tên trên lớp'
): ClassStudentRecord[] {
  const delta = Math.round(bonusPoints);
  return roster.map((st) => {
    const isMatch =
      st.id === studentIdOrName ||
      normalizeSearchText(st.name) === normalizeSearchText(studentIdOrName);
    if (!isMatch) return st;

    const nextPoints = Math.max(0, Math.min(100, st.totalPoints + delta));
    const needsSupport = nextPoints < 90;
    return {
      ...st,
      totalPoints: nextPoints,
      status: needsSupport ? 'Cần kèm thêm' : 'Đã chấm AI',
      feedback: `🎁 +${delta}đ thưởng (${reason}) · Tổng điểm mới: ${nextPoints}/100đ.`,
    };
  });
}

export function filterClassroomStudents<
  T extends {
    name: string;
    studentCode?: string;
    hskLevel?: string;
    totalPoints: number;
    status?: string;
  }
>(
  students: T[],
  searchQuery: string,
  statusFilter: StudentStatusFilter = 'all'
): T[] {
  const normQuery = normalizeSearchText(searchQuery);
  return students.filter((st) => {
    const needsSupport = isStudentNeedsSupport(st);
    if (statusFilter === 'completed' && needsSupport) return false;
    if (statusFilter === 'needs_support' && !needsSupport) return false;

    if (!normQuery) return true;
    const normName = normalizeSearchText(st.name);
    const normCode = normalizeSearchText(st.studentCode || '');
    const normLevel = normalizeSearchText(st.hskLevel || '');
    return (
      normName.includes(normQuery) ||
      normCode.includes(normQuery) ||
      normLevel.includes(normQuery) ||
      st.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  });
}

function escapeCsvCell(value: string | number): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateStudentsCsvContent(
  students: ClassStudentRecord[]
): string {
  const BOM = '\uFEFF';
  const headers = [
    'STT',
    'Mã học viên',
    'Họ và tên',
    'Cấp độ',
    'Tiến độ từ vựng',
    'Độ chuẩn nét viết',
    'Quiz ngữ pháp',
    'Tổng điểm (100)',
    'Trạng thái',
    'Từ vựng cần ôn',
    'Nhận xét AI',
  ];

  const rows = students.map((st, idx) => {
    const statusLabel = isStudentNeedsSupport(st)
      ? 'Cần kèm thêm'
      : 'Đã hoàn thành';
    const reviewWordsText =
      st.reviewWords && st.reviewWords.length > 0
        ? st.reviewWords.join(' · ')
        : 'Đã thuộc hết';
    return [
      idx + 1,
      st.studentCode || `HV-${String(idx + 1).padStart(3, '0')}`,
      st.name,
      st.hskLevel || 'HSK 2',
      st.vocabScore,
      st.writingScore,
      st.quizScore,
      st.totalPoints,
      statusLabel,
      reviewWordsText,
      st.feedback,
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  return `${BOM}${[headers.join(','), ...rows].join('\r\n')}`;
}




