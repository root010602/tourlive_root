const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

// 1. Supabase 접속 정보 확인
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// 자리표시자(placeholder) 값인지 확인하는 체크 로직 추가
const isPlaceholder = (val) => !val || val.includes('your_supabase') || val === 'YOUR_SUPABASE_URL';

if (isPlaceholder(SUPABASE_URL) || isPlaceholder(SUPABASE_ANON_KEY)) {
    console.error('\n❌ 에러: .env 파일에 실제 Supabase 접속 정보를 입력해주세요.');
    console.error('현재 설정된 URL:', SUPABASE_URL);
    console.error('\n방법:');
    console.error('1. Supabase 프로젝트 대시보드 -> Settings -> API 로 이동');
    console.error('2. Project URL과 anon public Key를 복사해서 .env 파일에 붙여넣으세요.\n');
    process.exit(1);
}

// URL 형식 검증 (간단히)
if (!SUPABASE_URL.startsWith('https://')) {
    console.error('\n❌ 에러: SUPABASE_URL 형식이 올바르지 않습니다. (https:// 로 시작해야 합니다)');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. 삽입할 맛집 데이터 30개
const restaurants = [
    // 서울 (10개)
    { city: "서울", name: "진옥화할매닭한마리", menu: "닭한마리", rating: 4.4, review_count: "12,500+", address: "서울 종로구 종로40가길 18", map_url: "https://www.google.com/maps/search/진옥화할매닭한마리+서울" },
    { city: "서울", name: "우래옥", menu: "평양냉면, 불고기", rating: 4.2, review_count: "8,900+", address: "서울 중구 창경궁로 62-29", map_url: "https://www.google.com/maps/search/우래옥+서울" },
    { city: "서울", name: "명동교자 본점", menu: "칼국수, 만두", rating: 4.5, review_count: "25,000+", address: "서울 중구 명동10길 29", map_url: "https://www.google.com/maps/search/명동교자+서울" },
    { city: "서울", name: "몽탄", menu: "우대갈비", rating: 4.3, review_count: "7,200+", address: "서울 용산구 백범로99길 50", map_url: "https://www.google.com/maps/search/몽탄+서울" },
    { city: "서울", name: "광장시장 부촌육회", menu: "육회, 육회물회", rating: 4.6, review_count: "5,400+", address: "서울 종로구 종로 200-4", map_url: "https://www.google.com/maps/search/부촌육회+서울" },
    { city: "서울", name: "오레노카츠 본점", menu: "체다치즈 돈까스", rating: 4.4, review_count: "2,100+", address: "서울 성동구 성수이로 58", map_url: "https://www.google.com/maps/search/오레노카츠+서울" },
    { city: "서울", name: "호남식당", menu: "물갈비", rating: 4.1, review_count: "1,500+", address: "서울 중구 퇴계로87길 15-3", map_url: "https://www.google.com/maps/search/호남식당+서울" },
    { city: "서울", name: "잭슨피자 한남점", menu: "수퍼잭슨 피자", rating: 4.5, review_count: "3,800+", address: "서울 용산구 독서당로 46", map_url: "https://www.google.com/maps/search/잭슨피자+서울" },
    { city: "서울", name: "토속촌 삼계탕", menu: "삼계탕", rating: 4.2, review_count: "15,000+", address: "서울 종로구 자하문로5길 5", map_url: "https://www.google.com/maps/search/토속촌삼계탕+서울" },
    { city: "서울", name: "엘리펀트키친", menu: "수제맥주, 피자", rating: 4.7, review_count: "900+", address: "서울 종로구 율곡로 10길 21", map_url: "https://www.google.com/maps/search/엘리펀트키친+서울" },

    // 부산 (10개)
    { city: "부산", name: "본전돼지국밥", menu: "돼지국밥", rating: 4.3, review_count: "9,500+", address: "부산 동구 중앙대로214번길 3-8", map_url: "https://www.google.com/maps/search/본전돼지국밥+부산" },
    { city: "부산", name: "해운대암소갈비집", menu: "생갈비, 양념갈비", rating: 4.2, review_count: "10,000+", address: "부산 해운대구 중동2로10번길 32-10", map_url: "https://www.google.com/maps/search/해운대암소갈비집+부산" },
    { city: "부산", name: "이재모피자", menu: "치즈크러스트 피자", rating: 4.6, review_count: "18,000+", address: "부산 중구 광복중앙로 31", map_url: "https://www.google.com/maps/search/이재모피자+부산" },
    { city: "부산", name: "상국이네", menu: "떡볶이, 김밥, 튀김", rating: 4.1, review_count: "7,800+", address: "부산 해운대구 구남로41번길 40-1", map_url: "https://www.google.com/maps/search/상국이네+부산" },
    { city: "부산", name: "영진돼지국밥 본점", menu: "수육백반", rating: 4.5, review_count: "5,200+", address: "부산 사하구 하신번영로 157", map_url: "https://www.google.com/maps/search/영진돼지국밥+부산" },
    { city: "부산", name: "신발원", menu: "고기만두, 군만두", rating: 4.4, review_count: "6,500+", address: "부산 동구 대영로243번길 62", map_url: "https://www.google.com/maps/search/신발원+부산" },
    { city: "부산", name: "톤쇼우 광안점", menu: "버크셔K 로스카츠", rating: 4.7, review_count: "4,500+", address: "부산 수영구 광안해변로279번길 13", map_url: "https://www.google.com/maps/search/톤쇼우+부산" },
    { city: "부산", name: "거대갈비", menu: "한우 생갈비", rating: 4.5, review_count: "3,200+", address: "부산 해운대구 달맞이길62번길 28", map_url: "https://www.google.com/maps/search/거대갈비+부산" },
    { city: "부산", name: "칠암사계", menu: "소금빵", rating: 4.3, review_count: "8,900+", address: "부산 기장군 일광읍 칠암길 7-10", map_url: "https://www.google.com/maps/search/칠암사계+부산" },
    { city: "부산", name: "초량밀면", menu: "물밀면, 비빔밀면", rating: 4.0, review_count: "12,000+", address: "부산 동구 중앙대로 225", map_url: "https://www.google.com/maps/search/초량밀면+부산" },

    // 제주 (10개)
    { city: "제주", name: "오는정김밥", menu: "오는정김밥, 멸치김밥", rating: 4.3, review_count: "11,000+", address: "제주 서귀포시 동문동로 2", map_url: "https://www.google.com/maps/search/오는정김밥+제주" },
    { city: "제주", name: "숙성도 노형본관", menu: "720 숙성 뼈등심", rating: 4.5, review_count: "9,200+", address: "제주 제주시 원노형로 41", map_url: "https://www.google.com/maps/search/숙성도+제주" },
    { city: "제주", name: "가시아방국수", menu: "고기국수, 커플세트", rating: 4.4, review_count: "6,800+", address: "제주 서귀포시 성산읍 고성동서로 67", map_url: "https://www.google.com/maps/search/가시아방국수+제주" },
    { city: "제주", name: "연돈", menu: "등심까스, 치즈까스", rating: 4.6, review_count: "15,000+", address: "제주 서귀포시 일주서로 968-10", map_url: "https://www.google.com/maps/search/연돈+제주" },
    { city: "제주", name: "우진해장국", menu: "고사리육개장", rating: 4.4, review_count: "13,000+", address: "제주 제주시 서사로 11", map_url: "https://www.google.com/maps/search/우진해장국+제주" },
    { city: "제주", name: "맛나식당", menu: "갈치조림", rating: 4.3, review_count: "4,500+", address: "제주 서귀포시 성산읍 동류암로 41", map_url: "https://www.google.com/maps/search/맛나식당+제주" },
    { city: "제주", name: "미영이네식당", menu: "고등어회 + 탕", rating: 4.7, review_count: "5,200+", address: "제주 서귀포시 대정읍 하모항구로 42", map_url: "https://www.google.com/maps/search/미영이네+제주" },
    { city: "제주", name: "산방식당 본점", menu: "제주식 밀냉면", rating: 4.2, review_count: "4,800+", address: "제주 서귀포시 대정읍 하모이삼로 62", map_url: "https://www.google.com/maps/search/산방식당+제주" },
    { city: "제주", name: "자매국수 노형점", menu: "고기국수, 비빔국수", rating: 4.1, review_count: "9,500+", address: "제주 제주시 항골남길 46", map_url: "https://www.google.com/maps/search/자매국수+제주" },
    { city: "제주", name: "은희네해장국 본점", menu: "소고기해장국", rating: 4.4, review_count: "7,500+", address: "제주 제주시 고마로13길 8", map_url: "https://www.google.com/maps/search/은희네해장국+제주" }
];

async function seedData() {
    console.log('데이터 삽입을 시작합니다...');

    const { data, error } = await supabase
        .from('restaurants')
        .insert(restaurants);

    if (error) {
        console.error('데이터 삽입 중 오류 발생:', error.message);
    } else {
        console.log('성공적으로 30개의 데이터가 삽입되었습니다! 🚀');
    }
}

seedData();
