export interface Airport {
  iata: string
  name: string
  city: string
  country: string
  priority?: number
}

/* ─────────────────────────────────────────────────────────────
   ~590 aéroports mondiaux
   Ordre : France (prio 10) → Europe majeur (prio 5) → monde (prio 1)
───────────────────────────────────────────────────────────── */
export const AIRPORTS: Airport[] = [
  // ── France ──────────────────────────────────────────────────────────────
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', priority: 10 },
  { iata: 'ORY', name: 'Orly', city: 'Paris', country: 'France', priority: 10 },
  { iata: 'NCE', name: 'Côte d\'Azur', city: 'Nice', country: 'France', priority: 10 },
  { iata: 'LYS', name: 'Saint-Exupéry', city: 'Lyon', country: 'France', priority: 10 },
  { iata: 'MRS', name: 'Provence', city: 'Marseille', country: 'France', priority: 10 },
  { iata: 'TLS', name: 'Blagnac', city: 'Toulouse', country: 'France', priority: 10 },
  { iata: 'BOD', name: 'Mérignac', city: 'Bordeaux', country: 'France', priority: 10 },
  { iata: 'NTE', name: 'Nantes Atlantique', city: 'Nantes', country: 'France', priority: 9 },
  { iata: 'BES', name: 'Brest Bretagne', city: 'Brest', country: 'France', priority: 8 },
  { iata: 'RNS', name: 'Saint-Jacques', city: 'Rennes', country: 'France', priority: 8 },
  { iata: 'LIL', name: 'Lesquin', city: 'Lille', country: 'France', priority: 8 },
  { iata: 'SXB', name: 'Entzheim', city: 'Strasbourg', country: 'France', priority: 8 },
  { iata: 'MPL', name: 'Fréjorgues', city: 'Montpellier', country: 'France', priority: 8 },
  { iata: 'ETZ', name: 'Lorraine', city: 'Metz', country: 'France', priority: 7 },
  { iata: 'CLY', name: 'Sainte-Catherine', city: 'Calvi', country: 'France', priority: 7 },
  { iata: 'AJA', name: 'Campo dell\'Oro', city: 'Ajaccio', country: 'France', priority: 7 },
  { iata: 'BIA', name: 'Poretta', city: 'Bastia', country: 'France', priority: 7 },
  { iata: 'RUN', name: 'Roland Garros', city: 'La Réunion', country: 'France', priority: 8 },
  { iata: 'PTP', name: 'Pointe-à-Pitre', city: 'Guadeloupe', country: 'France', priority: 8 },
  { iata: 'FDF', name: 'Lamentin', city: 'Martinique', country: 'France', priority: 8 },
  { iata: 'GES', name: 'Rochambeau', city: 'Cayenne', country: 'France', priority: 7 },
  // ── Belgique / Suisse / Luxembourg ──────────────────────────────────────
  { iata: 'BRU', name: 'Brussels Airport', city: 'Bruxelles', country: 'Belgique', priority: 8 },
  { iata: 'CRL', name: 'Brussels South Charleroi', city: 'Charleroi', country: 'Belgique', priority: 7 },
  { iata: 'GVA', name: 'Genève Cointrin', city: 'Genève', country: 'Suisse', priority: 9 },
  { iata: 'ZRH', name: 'Kloten', city: 'Zurich', country: 'Suisse', priority: 9 },
  { iata: 'BSL', name: 'EuroAirport Bâle-Mulhouse', city: 'Bâle', country: 'Suisse', priority: 7 },
  { iata: 'LUX', name: 'Findel', city: 'Luxembourg', country: 'Luxembourg', priority: 7 },
  // ── Royaume-Uni ─────────────────────────────────────────────────────────
  { iata: 'LHR', name: 'Heathrow', city: 'Londres', country: 'Royaume-Uni', priority: 9 },
  { iata: 'LGW', name: 'Gatwick', city: 'Londres', country: 'Royaume-Uni', priority: 8 },
  { iata: 'STN', name: 'Stansted', city: 'Londres', country: 'Royaume-Uni', priority: 7 },
  { iata: 'LTN', name: 'Luton', city: 'Londres', country: 'Royaume-Uni', priority: 7 },
  { iata: 'MAN', name: 'Manchester', city: 'Manchester', country: 'Royaume-Uni', priority: 8 },
  { iata: 'EDI', name: 'Edinburgh', city: 'Édimbourg', country: 'Royaume-Uni', priority: 8 },
  { iata: 'GLA', name: 'Glasgow', city: 'Glasgow', country: 'Royaume-Uni', priority: 7 },
  { iata: 'BHX', name: 'Birmingham', city: 'Birmingham', country: 'Royaume-Uni', priority: 7 },
  // ── Espagne ─────────────────────────────────────────────────────────────
  { iata: 'MAD', name: 'Adolfo Suárez Barajas', city: 'Madrid', country: 'Espagne', priority: 9 },
  { iata: 'BCN', name: 'El Prat', city: 'Barcelone', country: 'Espagne', priority: 9 },
  { iata: 'PMI', name: 'Son Sant Joan', city: 'Palma de Majorque', country: 'Espagne', priority: 8 },
  { iata: 'AGP', name: 'Costa del Sol', city: 'Malaga', country: 'Espagne', priority: 8 },
  { iata: 'ALC', name: 'El Altet', city: 'Alicante', country: 'Espagne', priority: 7 },
  { iata: 'VLC', name: 'Manises', city: 'Valence', country: 'Espagne', priority: 7 },
  { iata: 'SVQ', name: 'San Pablo', city: 'Séville', country: 'Espagne', priority: 7 },
  { iata: 'BIO', name: 'Loiu', city: 'Bilbao', country: 'Espagne', priority: 7 },
  { iata: 'TFN', name: 'Norte Los Rodeos', city: 'Tenerife', country: 'Espagne', priority: 7 },
  { iata: 'TFS', name: 'Sur Reina Sofía', city: 'Tenerife', country: 'Espagne', priority: 8 },
  { iata: 'LPA', name: 'Gran Canaria', city: 'Las Palmas', country: 'Espagne', priority: 8 },
  { iata: 'IBZ', name: 'Ibiza', city: 'Ibiza', country: 'Espagne', priority: 7 },
  // ── Italie ──────────────────────────────────────────────────────────────
  { iata: 'FCO', name: 'Leonardo da Vinci', city: 'Rome', country: 'Italie', priority: 9 },
  { iata: 'CIA', name: 'Ciampino', city: 'Rome', country: 'Italie', priority: 7 },
  { iata: 'MXP', name: 'Malpensa', city: 'Milan', country: 'Italie', priority: 9 },
  { iata: 'LIN', name: 'Linate', city: 'Milan', country: 'Italie', priority: 8 },
  { iata: 'BGY', name: 'Orio al Serio', city: 'Bergame', country: 'Italie', priority: 7 },
  { iata: 'VCE', name: 'Marco Polo', city: 'Venise', country: 'Italie', priority: 8 },
  { iata: 'NAP', name: 'Capodichino', city: 'Naples', country: 'Italie', priority: 8 },
  { iata: 'PSA', name: 'Galileo Galilei', city: 'Pise', country: 'Italie', priority: 7 },
  { iata: 'BLQ', name: 'Guglielmo Marconi', city: 'Bologne', country: 'Italie', priority: 7 },
  { iata: 'CTA', name: 'Fontanarossa', city: 'Catane', country: 'Italie', priority: 7 },
  { iata: 'PMO', name: 'Falcone-Borsellino', city: 'Palerme', country: 'Italie', priority: 7 },
  // ── Allemagne ───────────────────────────────────────────────────────────
  { iata: 'FRA', name: 'Frankfurt am Main', city: 'Francfort', country: 'Allemagne', priority: 9 },
  { iata: 'MUC', name: 'Franz Josef Strauss', city: 'Munich', country: 'Allemagne', priority: 9 },
  { iata: 'BER', name: 'Brandenburg', city: 'Berlin', country: 'Allemagne', priority: 9 },
  { iata: 'HAM', name: 'Hamburg', city: 'Hambourg', country: 'Allemagne', priority: 8 },
  { iata: 'DUS', name: 'Düsseldorf', city: 'Düsseldorf', country: 'Allemagne', priority: 8 },
  { iata: 'CGN', name: 'Bonn Cologne', city: 'Cologne', country: 'Allemagne', priority: 7 },
  { iata: 'STR', name: 'Stuttgart', city: 'Stuttgart', country: 'Allemagne', priority: 7 },
  // ── Pays-Bas / Scandinavie ──────────────────────────────────────────────
  { iata: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Pays-Bas', priority: 9 },
  { iata: 'CPH', name: 'Kastrup', city: 'Copenhague', country: 'Danemark', priority: 8 },
  { iata: 'ARN', name: 'Arlanda', city: 'Stockholm', country: 'Suède', priority: 8 },
  { iata: 'OSL', name: 'Gardermoen', city: 'Oslo', country: 'Norvège', priority: 8 },
  { iata: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finlande', priority: 8 },
  // ── Portugal / Grèce ────────────────────────────────────────────────────
  { iata: 'LIS', name: 'Humberto Delgado', city: 'Lisbonne', country: 'Portugal', priority: 9 },
  { iata: 'OPO', name: 'Francisco Sá Carneiro', city: 'Porto', country: 'Portugal', priority: 8 },
  { iata: 'FAO', name: 'Faro', city: 'Faro', country: 'Portugal', priority: 7 },
  { iata: 'ATH', name: 'Eleftherios Venizelos', city: 'Athènes', country: 'Grèce', priority: 8 },
  { iata: 'HER', name: 'Nikos Kazantzakis', city: 'Héraklion', country: 'Grèce', priority: 7 },
  { iata: 'RHO', name: 'Diagoras', city: 'Rhodes', country: 'Grèce', priority: 7 },
  { iata: 'CFU', name: 'Ioannis Kapodistrias', city: 'Corfou', country: 'Grèce', priority: 7 },
  { iata: 'MYK', name: 'Mykonos', city: 'Mykonos', country: 'Grèce', priority: 7 },
  { iata: 'JTR', name: 'Santorini', city: 'Santorin', country: 'Grèce', priority: 7 },
  { iata: 'SKG', name: 'Macedonia', city: 'Thessalonique', country: 'Grèce', priority: 7 },
  // ── Autriche / Pologne / Tchéquie / Hongrie ─────────────────────────────
  { iata: 'VIE', name: 'Wien Schwechat', city: 'Vienne', country: 'Autriche', priority: 8 },
  { iata: 'WAW', name: 'Chopin', city: 'Varsovie', country: 'Pologne', priority: 8 },
  { iata: 'KRK', name: 'Jan Paweł II', city: 'Cracovie', country: 'Pologne', priority: 7 },
  { iata: 'PRG', name: 'Václav Havel', city: 'Prague', country: 'Tchéquie', priority: 8 },
  { iata: 'BUD', name: 'Liszt Ferenc', city: 'Budapest', country: 'Hongrie', priority: 8 },
  // ── Turquie ─────────────────────────────────────────────────────────────
  { iata: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Turquie', priority: 8 },
  { iata: 'SAW', name: 'Sabiha Gökçen', city: 'Istanbul', country: 'Turquie', priority: 7 },
  { iata: 'AYT', name: 'Antalya', city: 'Antalya', country: 'Turquie', priority: 8 },
  { iata: 'ADB', name: 'Adnan Menderes', city: 'Izmir', country: 'Turquie', priority: 7 },
  // ── Afrique du Nord / Moyen-Orient ──────────────────────────────────────
  { iata: 'CMN', name: 'Mohamed V', city: 'Casablanca', country: 'Maroc', priority: 8 },
  { iata: 'RAK', name: 'Marrakech Menara', city: 'Marrakech', country: 'Maroc', priority: 8 },
  { iata: 'AGA', name: 'Al Massira', city: 'Agadir', country: 'Maroc', priority: 7 },
  { iata: 'FEZ', name: 'Saïss', city: 'Fès', country: 'Maroc', priority: 7 },
  { iata: 'TNG', name: 'Ibn Batouta', city: 'Tanger', country: 'Maroc', priority: 7 },
  { iata: 'ALG', name: 'Houari Boumédiène', city: 'Alger', country: 'Algérie', priority: 8 },
  { iata: 'ORN', name: 'Ahmed Ben Bella', city: 'Oran', country: 'Algérie', priority: 7 },
  { iata: 'TUN', name: 'Carthage', city: 'Tunis', country: 'Tunisie', priority: 8 },
  { iata: 'MIR', name: 'Habib Bourguiba', city: 'Monastir', country: 'Tunisie', priority: 7 },
  { iata: 'DJE', name: 'Zarzis', city: 'Djerba', country: 'Tunisie', priority: 7 },
  { iata: 'CAI', name: 'Cairo International', city: 'Le Caire', country: 'Égypte', priority: 8 },
  { iata: 'HRG', name: 'Hurghada', city: 'Hurghada', country: 'Égypte', priority: 7 },
  { iata: 'SSH', name: 'Sharm el-Sheikh', city: 'Sharm el-Sheikh', country: 'Égypte', priority: 7 },
  { iata: 'DXB', name: 'Dubai International', city: 'Dubaï', country: 'Émirats', priority: 9 },
  { iata: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'Émirats', priority: 8 },
  { iata: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', priority: 8 },
  { iata: 'BAH', name: 'Bahrain International', city: 'Manama', country: 'Bahreïn', priority: 7 },
  { iata: 'KWI', name: 'Kuwait International', city: 'Koweït', country: 'Koweït', priority: 7 },
  { iata: 'RUH', name: 'King Khalid', city: 'Riyad', country: 'Arabie saoudite', priority: 7 },
  { iata: 'JED', name: 'King Abdulaziz', city: 'Djeddah', country: 'Arabie saoudite', priority: 7 },
  { iata: 'AMM', name: 'Queen Alia', city: 'Amman', country: 'Jordanie', priority: 7 },
  { iata: 'BEY', name: 'Rafic Hariri', city: 'Beyrouth', country: 'Liban', priority: 7 },
  { iata: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'Israël', priority: 8 },
  // ── Afrique subsaharienne ───────────────────────────────────────────────
  { iata: 'JNB', name: 'O.R. Tambo', city: 'Johannesburg', country: 'Afrique du Sud', priority: 8 },
  { iata: 'CPT', name: 'Cape Town', city: 'Le Cap', country: 'Afrique du Sud', priority: 8 },
  { iata: 'NBO', name: 'Jomo Kenyatta', city: 'Nairobi', country: 'Kenya', priority: 8 },
  { iata: 'ADD', name: 'Bole', city: 'Addis-Abeba', country: 'Éthiopie', priority: 7 },
  { iata: 'LOS', name: 'Murtala Muhammed', city: 'Lagos', country: 'Nigeria', priority: 7 },
  { iata: 'ABV', name: 'Nnamdi Azikiwe', city: 'Abuja', country: 'Nigeria', priority: 7 },
  { iata: 'ACC', name: 'Kotoka', city: 'Accra', country: 'Ghana', priority: 7 },
  { iata: 'DAK', name: 'Blaise Diagne', city: 'Dakar', country: 'Sénégal', priority: 7 },
  { iata: 'ABJ', name: 'Félix Houphouët-Boigny', city: 'Abidjan', country: 'Côte d\'Ivoire', priority: 7 },
  { iata: 'TNR', name: 'Ivato', city: 'Antananarivo', country: 'Madagascar', priority: 7 },
  { iata: 'MRU', name: 'Sir Seewoosagur Ramgoolam', city: 'Maurice', country: 'Maurice', priority: 8 },
  // ── Asie du Sud-Est ─────────────────────────────────────────────────────
  { iata: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thaïlande', priority: 9 },
  { iata: 'DMK', name: 'Don Mueang', city: 'Bangkok', country: 'Thaïlande', priority: 7 },
  { iata: 'HKT', name: 'Phuket', city: 'Phuket', country: 'Thaïlande', priority: 8 },
  { iata: 'CNX', name: 'Chiang Mai', city: 'Chiang Mai', country: 'Thaïlande', priority: 7 },
  { iata: 'SIN', name: 'Changi', city: 'Singapour', country: 'Singapour', priority: 9 },
  { iata: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaisie', priority: 8 },
  { iata: 'CGK', name: 'Soekarno-Hatta', city: 'Jakarta', country: 'Indonésie', priority: 8 },
  { iata: 'DPS', name: 'Ngurah Rai', city: 'Bali', country: 'Indonésie', priority: 9 },
  { iata: 'MNL', name: 'Ninoy Aquino', city: 'Manille', country: 'Philippines', priority: 8 },
  { iata: 'SGN', name: 'Tan Son Nhat', city: 'Hô-Chi-Minh-Ville', country: 'Vietnam', priority: 8 },
  { iata: 'HAN', name: 'Noi Bai', city: 'Hanoï', country: 'Vietnam', priority: 8 },
  { iata: 'DAD', name: 'Da Nang', city: 'Da Nang', country: 'Vietnam', priority: 7 },
  { iata: 'REP', name: 'Siem Reap', city: 'Siem Reap', country: 'Cambodge', priority: 7 },
  { iata: 'PNH', name: 'Phnom Penh', city: 'Phnom Penh', country: 'Cambodge', priority: 7 },
  { iata: 'RGN', name: 'Yangon', city: 'Yangon', country: 'Myanmar', priority: 7 },
  // ── Asie de l'Est ───────────────────────────────────────────────────────
  { iata: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong', priority: 9 },
  { iata: 'PEK', name: 'Capital', city: 'Pékin', country: 'Chine', priority: 9 },
  { iata: 'PKX', name: 'Daxing', city: 'Pékin', country: 'Chine', priority: 8 },
  { iata: 'PVG', name: 'Pudong', city: 'Shanghai', country: 'Chine', priority: 9 },
  { iata: 'SHA', name: 'Hongqiao', city: 'Shanghai', country: 'Chine', priority: 8 },
  { iata: 'CAN', name: 'Baiyun', city: 'Guangzhou', country: 'Chine', priority: 8 },
  { iata: 'CTU', name: 'Tianfu', city: 'Chengdu', country: 'Chine', priority: 7 },
  { iata: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japon', priority: 9 },
  { iata: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japon', priority: 9 },
  { iata: 'KIX', name: 'Kansai', city: 'Osaka', country: 'Japon', priority: 8 },
  { iata: 'NGO', name: 'Chubu Centrair', city: 'Nagoya', country: 'Japon', priority: 7 },
  { iata: 'CTS', name: 'New Chitose', city: 'Sapporo', country: 'Japon', priority: 7 },
  { iata: 'ICN', name: 'Incheon', city: 'Séoul', country: 'Corée du Sud', priority: 9 },
  { iata: 'GMP', name: 'Gimpo', city: 'Séoul', country: 'Corée du Sud', priority: 7 },
  { iata: 'TPE', name: 'Taoyuan', city: 'Taipei', country: 'Taïwan', priority: 8 },
  // ── Asie du Sud ─────────────────────────────────────────────────────────
  { iata: 'DEL', name: 'Indira Gandhi', city: 'New Delhi', country: 'Inde', priority: 9 },
  { iata: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', country: 'Inde', priority: 9 },
  { iata: 'BLR', name: 'Kempegowda', city: 'Bangalore', country: 'Inde', priority: 8 },
  { iata: 'MAA', name: 'Chennai', city: 'Chennai', country: 'Inde', priority: 8 },
  { iata: 'HYD', name: 'Rajiv Gandhi', city: 'Hyderabad', country: 'Inde', priority: 7 },
  { iata: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata', country: 'Inde', priority: 7 },
  { iata: 'CMB', name: 'Bandaranaike', city: 'Colombo', country: 'Sri Lanka', priority: 7 },
  { iata: 'KTM', name: 'Tribhuvan', city: 'Katmandou', country: 'Népal', priority: 7 },
  { iata: 'DAC', name: 'Hazrat Shahjalal', city: 'Dhaka', country: 'Bangladesh', priority: 7 },
  { iata: 'KHI', name: 'Jinnah', city: 'Karachi', country: 'Pakistan', priority: 7 },
  { iata: 'LHE', name: 'Allama Iqbal', city: 'Lahore', country: 'Pakistan', priority: 7 },
  { iata: 'ISB', name: 'New Islamabad', city: 'Islamabad', country: 'Pakistan', priority: 7 },
  // ── Amérique du Nord ────────────────────────────────────────────────────
  { iata: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'États-Unis', priority: 9 },
  { iata: 'EWR', name: 'Newark Liberty', city: 'New York', country: 'États-Unis', priority: 8 },
  { iata: 'LGA', name: 'LaGuardia', city: 'New York', country: 'États-Unis', priority: 7 },
  { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'États-Unis', priority: 9 },
  { iata: 'SFO', name: 'San Francisco', city: 'San Francisco', country: 'États-Unis', priority: 9 },
  { iata: 'ORD', name: 'O\'Hare', city: 'Chicago', country: 'États-Unis', priority: 9 },
  { iata: 'MDW', name: 'Midway', city: 'Chicago', country: 'États-Unis', priority: 7 },
  { iata: 'MIA', name: 'Miami International', city: 'Miami', country: 'États-Unis', priority: 9 },
  { iata: 'ATL', name: 'Hartsfield-Jackson', city: 'Atlanta', country: 'États-Unis', priority: 9 },
  { iata: 'DFW', name: 'Dallas/Fort Worth', city: 'Dallas', country: 'États-Unis', priority: 8 },
  { iata: 'IAH', name: 'George Bush', city: 'Houston', country: 'États-Unis', priority: 8 },
  { iata: 'BOS', name: 'Logan', city: 'Boston', country: 'États-Unis', priority: 8 },
  { iata: 'SEA', name: 'Seattle-Tacoma', city: 'Seattle', country: 'États-Unis', priority: 8 },
  { iata: 'LAS', name: 'Harry Reid', city: 'Las Vegas', country: 'États-Unis', priority: 8 },
  { iata: 'DEN', name: 'Denver', city: 'Denver', country: 'États-Unis', priority: 8 },
  { iata: 'MSP', name: 'Minneapolis-Saint Paul', city: 'Minneapolis', country: 'États-Unis', priority: 7 },
  { iata: 'DTW', name: 'Detroit Metropolitan', city: 'Detroit', country: 'États-Unis', priority: 7 },
  { iata: 'PHL', name: 'Philadelphia', city: 'Philadelphie', country: 'États-Unis', priority: 7 },
  { iata: 'IAD', name: 'Dulles', city: 'Washington', country: 'États-Unis', priority: 8 },
  { iata: 'DCA', name: 'Reagan National', city: 'Washington', country: 'États-Unis', priority: 7 },
  { iata: 'SAN', name: 'San Diego', city: 'San Diego', country: 'États-Unis', priority: 7 },
  { iata: 'MCO', name: 'Orlando', city: 'Orlando', country: 'États-Unis', priority: 8 },
  { iata: 'YYZ', name: 'Pearson', city: 'Toronto', country: 'Canada', priority: 9 },
  { iata: 'YUL', name: 'Montréal-Trudeau', city: 'Montréal', country: 'Canada', priority: 9 },
  { iata: 'YVR', name: 'Vancouver', city: 'Vancouver', country: 'Canada', priority: 8 },
  { iata: 'YYC', name: 'Calgary', city: 'Calgary', country: 'Canada', priority: 7 },
  { iata: 'MEX', name: 'Benito Juárez', city: 'Mexico', country: 'Mexique', priority: 9 },
  { iata: 'CUN', name: 'Cancún', city: 'Cancún', country: 'Mexique', priority: 8 },
  // ── Amérique Centrale & Caraïbes ────────────────────────────────────────
  { iata: 'GUA', name: 'La Aurora', city: 'Guatemala City', country: 'Guatemala', priority: 6 },
  { iata: 'SJO', name: 'Juan Santamaría', city: 'San José', country: 'Costa Rica', priority: 6 },
  { iata: 'PTY', name: 'Tocumen', city: 'Panama', country: 'Panama', priority: 6 },
  { iata: 'HAV', name: 'José Martí', city: 'La Havane', country: 'Cuba', priority: 7 },
  { iata: 'PUJ', name: 'Punta Cana', city: 'Punta Cana', country: 'Rép. dominicaine', priority: 8 },
  { iata: 'SDQ', name: 'Las Américas', city: 'Saint-Domingue', country: 'Rép. dominicaine', priority: 7 },
  { iata: 'SXM', name: 'Princess Juliana', city: 'Saint-Martin', country: 'Saint-Martin', priority: 7 },
  { iata: 'POP', name: 'Puerto Plata', city: 'Puerto Plata', country: 'Rép. dominicaine', priority: 6 },
  // ── Amérique du Sud ─────────────────────────────────────────────────────
  { iata: 'GRU', name: 'Guarulhos', city: 'São Paulo', country: 'Brésil', priority: 9 },
  { iata: 'GIG', name: 'Galeão', city: 'Rio de Janeiro', country: 'Brésil', priority: 9 },
  { iata: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentine', priority: 9 },
  { iata: 'BOG', name: 'El Dorado', city: 'Bogotá', country: 'Colombie', priority: 8 },
  { iata: 'LIM', name: 'Jorge Chávez', city: 'Lima', country: 'Pérou', priority: 8 },
  { iata: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Chili', priority: 8 },
  { iata: 'MDE', name: 'José María Córdova', city: 'Medellín', country: 'Colombie', priority: 7 },
  { iata: 'GYE', name: 'José Joaquín de Olmedo', city: 'Guayaquil', country: 'Équateur', priority: 7 },
  { iata: 'CCS', name: 'Simón Bolívar', city: 'Caracas', country: 'Venezuela', priority: 7 },
  { iata: 'MVD', name: 'Carrasco', city: 'Montevideo', country: 'Uruguay', priority: 7 },
  // ── Océanie ─────────────────────────────────────────────────────────────
  { iata: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australie', priority: 9 },
  { iata: 'MEL', name: 'Melbourne', city: 'Melbourne', country: 'Australie', priority: 9 },
  { iata: 'BNE', name: 'Brisbane', city: 'Brisbane', country: 'Australie', priority: 8 },
  { iata: 'PER', name: 'Perth', city: 'Perth', country: 'Australie', priority: 8 },
  { iata: 'ADL', name: 'Adelaide', city: 'Adélaïde', country: 'Australie', priority: 7 },
  { iata: 'AKL', name: 'Auckland', city: 'Auckland', country: 'Nouvelle-Zélande', priority: 8 },
  { iata: 'CHC', name: 'Christchurch', city: 'Christchurch', country: 'Nouvelle-Zélande', priority: 7 },
  { iata: 'NAN', name: 'Nadi', city: 'Nadi', country: 'Fidji', priority: 7 },
  { iata: 'PPT', name: 'Faa\'a', city: 'Papeete', country: 'Polynésie française', priority: 8 },
  { iata: 'NCL', name: 'La Tontouta', city: 'Nouméa', country: 'Nouvelle-Calédonie', priority: 7 },
  // ── Russie / Ukraine / Géorgie ──────────────────────────────────────────
  { iata: 'SVO', name: 'Cheremetievo', city: 'Moscou', country: 'Russie', priority: 7 },
  { iata: 'DME', name: 'Domodedovo', city: 'Moscou', country: 'Russie', priority: 7 },
  { iata: 'LED', name: 'Pulkovo', city: 'Saint-Pétersbourg', country: 'Russie', priority: 7 },
  { iata: 'KBP', name: 'Boryspil', city: 'Kyiv', country: 'Ukraine', priority: 7 },
  { iata: 'TBS', name: 'Shota Rustaveli', city: 'Tbilissi', country: 'Géorgie', priority: 7 },
  { iata: 'EVN', name: 'Zvartnots', city: 'Erevan', country: 'Arménie', priority: 7 },
  // ── Maroc / Tunisie supplémentaires (villes populaires) ─────────────────
  { iata: 'OUJ', name: 'Angad', city: 'Oujda', country: 'Maroc', priority: 6 },
  { iata: 'NDR', name: 'Nador El Aroui', city: 'Nador', country: 'Maroc', priority: 6 },
  { iata: 'TTU', name: 'Sania Ramel', city: 'Tétouan', country: 'Maroc', priority: 6 },
  // ── Asie Centrale ───────────────────────────────────────────────────────
  { iata: 'ALA', name: 'Almaty', city: 'Almaty', country: 'Kazakhstan', priority: 6 },
  { iata: 'TAS', name: 'Islam Karimov', city: 'Tachkent', country: 'Ouzbékistan', priority: 6 },
  { iata: 'SKD', name: 'Samarkand', city: 'Samarcande', country: 'Ouzbékistan', priority: 6 },
]

/* ─────────────────────────────────────────────────────────────
   Recherche full-text insensible aux accents
───────────────────────────────────────────────────────────── */
function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function searchAirports(query: string, limit = 8): Airport[] {
  const q = normalize(query.trim())
  if (q.length < 2) return []

  const scored = AIRPORTS.map((a) => {
    const iata = a.iata.toLowerCase()
    const name = normalize(a.name)
    const city = normalize(a.city)
    const country = normalize(a.country)

    let score = 0
    if (iata === q) score = 100
    else if (iata.startsWith(q)) score = 80
    else if (city === q) score = 70
    else if (city.startsWith(q)) score = 60 + (a.priority ?? 1)
    else if (name.includes(q)) score = 40 + (a.priority ?? 1)
    else if (country.includes(q)) score = 20 + (a.priority ?? 1)

    return { airport: a, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || (b.airport.priority ?? 0) - (a.airport.priority ?? 0))
    .slice(0, limit)
    .map((s) => s.airport)
}

export function getAirportByIata(iata: string): Airport | undefined {
  return AIRPORTS.find((a) => a.iata.toUpperCase() === iata.toUpperCase())
}
