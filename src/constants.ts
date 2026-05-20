/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Item {
  id: string;
  name: string;
  category: 'outer' | 'tops' | 'bottoms' | 'shoes' | 'accessories';
  semantics: ('Clean' | 'Soft' | 'Urban' | 'Active' | 'Relaxed')[];
  image: string;
  match?: string;
  type?: string;
  gender?: 'male' | 'female' | 'both';
  color?: string;
  season?: string;
}

export interface Outfit {
  id: string;
  name: string;
  occasion: string;
  matchPercentage: number;
  tags: string[];
  image: string;
  notes: string;
  minTemp?: number;
  maxTemp?: number;
  wearCount: number;
  lastWorn: string;
  gender?: 'male' | 'female' | 'both';
}

export const ITEMS: Item[] = [
  {
    id: 't1',
    name: '리넨 블레이저',
    category: 'outer',
    semantics: ['Urban', 'Clean'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaY0d6kvLFP2CGTm6Ia_qZrT0ACd6UOZgTazr2zYCeYGnibp-ZN0I-6xlWMQOANuYi5R1KgxH6W1xgXSCJwv0aIYw0lzdh1VvdQ89HRMwTvi7RClkbjF2ZLbYv2WPfhn_Tudr7WWG2jitAhM7mk-YlSaVu6jmwdIIpMeovGIpNzb4lf6T-5TOVIJOiMU43zXqqd97-FsLiOl1Z8e36F5L4DDcxSET4QAQDayxeLaIB2fndUGjhWY41sImbOAFK2K8F7-00OVOlIV0',
    type: '아우터',
    gender: 'male',
    color: 'Navy',
    season: 'Spring/Summer'
  },
  {
    id: 't2',
    name: '캐시미어 니트',
    category: 'tops',
    semantics: ['Soft', 'Relaxed'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3xYOo4rzD9hO5InCIfd_HA9gFav2NeCBzzD-tkTzZl_OcBp3vcI6Zox7xyw9P9nxhjaayvTuJYdsWJsvrQKhad9uKipb0DJgCEzXvhP86hbE4p-elZoAFncTloNvyRogbELEvv4rjaRkdcaFui-FvoZgzZezNLszBm6vTnzzPvKLQQpbPubgmGIDKUdcTeh8Vng49QP6BkfuuTMtvMAPw5HkegKwfEBtXMW5O6pX_nptrl1NFCOVpT4wdfJ5gK9wN2c6t8a0tbH4',
    type: '상의',
    gender: 'both',
    color: 'Black',
    season: 'Autumn/Winter'
  },
  {
    id: 'b1',
    name: '인디고 데님',
    category: 'bottoms',
    semantics: ['Active', 'Urban'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3oY9A6-HD9Rf_YbSGGwyXQeDALBjrbWj8WwD8LVmRbpj1Hiqp0SbcXR2sEMD8cPWRbDboyD8542a4JpxxAUMd4nXVZjzwdHp9YvrQT8_QjahmwgzxR8vO58fHCwX-Y41XaZC16SpLFJGYftOv86cqrvEvLU-3w14DhL-dcj9rRAE5of4uFMm8t_bm7VQqZwaxtZbeXGqnHUNRveFF3v19OIYuXh2arhugVlREltCEDXmYotkMGYY5Ha2G2xAxqomtInwM3OAtl9U',
    type: '하의',
    gender: 'both',
    color: 'Navy',
    season: 'All Year'
  },
  {
    id: 's1',
    name: 'Tan Chelsea Boots',
    category: 'shoes',
    semantics: ['Urban', 'Clean'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOCB33r5_HoSbHxhl6_QMGqDGiAojtrOefiv-Ewaw1QIB0jBM3s0MtQHzTIPqP6jPnEejxNcUbD0RkJDFdZQAAi3BB2y9XTh_HsySZJydi0WT_lRiO46MJWH7vbUSDz_lHRsUphvbMFJ__7bxyyR1nx8PjH69Ducd2n8ScLC-gDwX5PwMnESjK42SkA9ZRDHnOHMV823wbY0QsCUXmBMsK3H-WhfR1WRFJmy8Cv9N45QSv7JbEWzh0hpHu8yJaff56OS-FcN7aibk',
    type: 'Footwear',
    gender: 'male',
    color: 'Beige',
    season: 'Autumn/Winter'
  },
  {
    id: 's2',
    name: 'Urban Sneaker',
    category: 'shoes',
    semantics: ['Active', 'Urban'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGxIL_3sez4z_oPnLkQpNz6Dn8nSviwl1D-Ef6_hYKCVIscMRWxBBFaKIaxwXdLCF37UV939Ke4_myTjDkzBw2aw-h0cE30KZ_rKM4PDOh3ue4DRCf3mKlgP1T4l3XIsVaAkHv9OIqLN4wnRoMds1FsNDdLxOb1W_U2NUAFc2aj8plNhxqPWyIcHyNlEKlDUNIVENbpPBUJFww5QsCGAsP82iJFrDSh3V-xZsXutYe84Cxm5Wz2R8r3E8NS84DJKIHhummX11CxYY',
    type: 'Footwear',
    gender: 'both',
    color: 'White',
    season: 'All Year'
  },
  {
    id: 'a1',
    name: 'Tapered Wool Trousers',
    category: 'bottoms',
    semantics: ['Clean', 'Urban'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL4sz0aKKuPdi8ZU0LBRWKixVZ1c-hIAPtn1BSQLBmiInwL0FGKVAw0oiXw4zmGDDhYchnAjEr_i7idH-HIS0cVph4T-wylCDxWTKPxrDZUDm0L911UgA7W9T7Jc2gbLTf7jGozDXh8Gw1LMysJ7Z20RZANYrocgR3FMw9o4nU2nOWQxQEy3Ff8vc1F2hc3HfQuBPtixz0Y-Cy2JxGjo9c7euAUpC1KIoDLlpNFJt9p9G0LEz4CuIQRlVwa_oJ2OeReuIcliyhAVQ',
    gender: 'male',
    color: 'Black',
    season: 'Autumn/Winter'
  },
  {
    id: 'f1',
    name: '플라워 미디 스커트',
    category: 'bottoms',
    semantics: ['Soft', 'Relaxed'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaY0d6kvLFP2CGTm6Ia_qZrT0ACd6UOZgTazr2zYCeYGnibp-ZN0I-6xlWMQOANuYi5R1KgxH6W1xgXSCJwv0aIYw0lzdh1VvdQ89HRMwTvi7RClkbjF2ZLbYv2WPfhn_Tudr7WWG2jitAhM7mk-YlSaVu6jmwdIIpMeovGIpNzb4lf6T-5TOVIJOiMU43zXqqd97-FsLiOl1Z8e36F5L4DDcxSET4QAQDayxeLaIB2fndUGjhWY41sImbOAFK2K8F7-00OVOlIV0',
    gender: 'female',
    color: 'Beige',
    season: 'Spring/Summer'
  }
];

export const OUTFITS: Outfit[] = [
  {
    id: 'o1',
    name: '리넨 소피스티케이트',
    occasion: 'OFFICE',
    matchPercentage: 98,
    tags: ['어반', '클린', '통기성'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA04cj2nO_lvdgoh7LaPTGv_Riber8j0C6ehm_GBYOx4NWyRZWWuhogx7iaQdGNKKuJmQxFktAhFdaJZsjTW2AOSaoO_yVb6jXpSJKYGCk-8PqxHXtSrL2nR6W8LbTXHggJQXdokCfq__yA2j5pasRteb4nYWpceeZoOhgrws6Pyw6tOx8cquCw76f172BR5Cw39MY00QjBxJ8oJ7buOsf5AaHYs9KQDeXvGDVJ8CpWCFtSzkspIrdwd33YRXkMmSwi3Ja3Gm5JkJc',
    notes: '따뜻한 날씨의 비즈니스 데이에 완벽한 조합입니다.',
    minTemp: 20,
    maxTemp: 32,
    wearCount: 12,
    lastWorn: '2026-05-14',
    gender: 'male'
  },
  {
    id: 'o2',
    name: '모노크롬 엣지',
    occasion: 'MINIMAL',
    matchPercentage: 92,
    tags: ['어반', '액티브', '미니멀'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUrBtV6wVqbq4Zk0TpCuIUYhyqX5iOiJ1Qy1OiR6rdLIqwO11OxdxYFplw9k5fkysNFb_HQx8Okaj6GRNq5a2aBeMTUxb-NOneuaO2Qg-vAZZLKYeJXLrUtBT-grg7HGaTE3EI2gLeQhlmMawNI9s_WFMhfr09sO7XGPi5kYhzQM8YvYnsVwYd9K6L6298wYAqF76jyWZwvy7AXySVWKEzNCDswLxpYSykQY8eBtkmrtDrLtUHOGgtsyYmlikNkI-F1GdxyMHLbYY',
    notes: '적당한 기온에서 활용하기 좋은 다채로운 선택지입니다.',
    minTemp: 15,
    maxTemp: 25,
    wearCount: 24,
    lastWorn: '2026-05-10',
    gender: 'both'
  },
  {
    id: 'o3',
    name: 'Evening Fluidity',
    occasion: 'MINIMAL',
    matchPercentage: 85,
    tags: ['Soft', 'Clean', 'Silk'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD103TQUWhyHw09k1mOKJasx3K_ocSTfFUkP-Ox522ojFF-QAuys9SPuP0k7u4q0jwebbplNYDdCZpw_xORY4XX-gp9jrloR7spjLP3o112484H9npomyMiUJ_2jEGoB5H0tiu2J8xPZVHUoyC4ew9LANwYxRfgnE1uuWsILvT1QbGe1snJzwIOZ6ZEfrzZQqHgOWwWF4z7lybA4hJVh3q7b3ZvsIr1rX1rLrwH2nx0yaM9xxih-gHZfOrAYp1fbkFDlnEzEgXXgwk',
    notes: 'Elegant silk for a sophisticated night out.',
    minTemp: 18,
    maxTemp: 28,
    wearCount: 5,
    lastWorn: '2026-05-12',
    gender: 'female'
  },
  {
    id: 'o5',
    name: 'Summer Flow',
    occasion: 'CAMPUS',
    matchPercentage: 90,
    tags: ['Soft', 'Summer', 'Casual'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD103TQUWhyHw09k1mOKJasx3K_ocSTfFUkP-Ox522ojFF-QAuys9SPuP0k7u4q0jwebbplNYDdCZpw_xORY4XX-gp9jrloR7spjLP3o112484H9npomyMiUJ_2jEGoB5H0tiu2J8xPZVHUoyC4ew9LANwYxRfgnE1uuWsILvT1QbGe1snJzwIOZ6ZEfrzZQqHgOWwWF4z7lybA4hJVh3q7b3ZvsIr1rX1rLrwH2nx0yaM9xxih-gHZfOrAYp1fbkFDlnEzEgXXgwk',
    notes: 'Light and airy for hot summer days.',
    minTemp: 22,
    maxTemp: 35,
    wearCount: 3,
    lastWorn: '2026-05-16',
    gender: 'female'
  },
  {
    id: 'o6',
    name: 'Urban Explorer',
    occasion: 'STREET',
    matchPercentage: 94,
    tags: ['Active', 'Urban', 'Durable'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGxIL_3sez4z_oPnLkQpNz6Dn8nSviwl1D-Ef6_hYKCVIscMRWxBBFaKIaxwXdLCF37UV939Ke4_myTjDkzBw2aw-h0cE30KZ_rKM4PDOh3ue4DRCf3mKlgP1T4l3XIsVaAkHv9OIqLN4wnRoMds1FsNDdLxOb1W_U2NUAFc2aj8plNhxqPWyIcHyNlEKlDUNIVENbpPBUJFww5QsCGAsP82iJFrDSh3V-xZsXutYe84Cxm5Wz2R8r3E8NS84DJKIHhummX11CxYY',
    notes: 'Perfect for city walks and casual meetups.',
    minTemp: 18,
    maxTemp: 28,
    wearCount: 15,
    lastWorn: '2026-05-15',
    gender: 'male'
  },
  {
    id: 'o7',
    name: 'Business Casual Mix',
    occasion: 'OFFICE',
    matchPercentage: 88,
    tags: ['Clean', 'Smart', 'Comfort'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaY0d6kvLFP2CGTm6Ia_qZrT0ACd6UOZgTazr2zYCeYGnibp-ZN0I-6xlWMQOANuYi5R1KgxH6W1xgXSCJwv0aIYw0lzdh1VvdQ89HRMwTvi7RClkbjF2ZLbYv2WPfhn_Tudr7WWG2jitAhM7mk-YlSaVu6jmwdIIpMeovGIpNzb4lf6T-5TOVIJOiMU43zXqqd97-FsLiOl1Z8e36F5L4DDcxSET4QAQDayxeLaIB2fndUGjhWY41sImbOAFK2K8F7-00OVOlIV0',
    notes: 'Polished yet relaxed for the modern office.',
    minTemp: 15,
    maxTemp: 26,
    wearCount: 10,
    lastWorn: '2026-05-13',
    gender: 'female'
  }
];


