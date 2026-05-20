export interface Persona {
  id: string;
  category: string;
  image: string;
  mood: string;
  tags: string[];
  gender: 'male' | 'female';
}

export const PERSONA_DATA: Persona[] = [
  { id: 'FK_01', category: 'Feminine Korean', image: '/personas/FK_01.png', mood: 'Daily Denim', tags: ['Comfort', 'Daily', 'Denim'], gender: 'female' },
  { id: 'FK_02', category: 'Feminine Korean', image: '/personas/FK_02.png', mood: 'Classic Skirt', tags: ['Clean', 'Classic', 'Feminine'], gender: 'female' },
  { id: 'FK_03', category: 'Feminine Korean', image: '/personas/FK_03.png', mood: 'Midi Skirt', tags: ['Soft', 'Urban', 'Elegance'], gender: 'female' },
  { id: 'FK_07', category: 'Feminine Korean', image: '/personas/FK_07.png', mood: 'Pattern Skirt', tags: ['Unique', 'Pattern', 'Vibrant'], gender: 'female' },
  { id: 'FK_08', category: 'Feminine Korean', image: '/personas/FK_08.png', mood: 'Chino Pants', tags: ['Practical', 'Clean', 'Casual'], gender: 'female' },
  { id: 'FK_09', category: 'Feminine Korean', image: '/personas/FK_09.png', mood: 'Straight Fit', tags: ['Active', 'Urban', 'Minimal'], gender: 'female' },
  { id: 'FK_011', category: 'Feminine Korean', image: '/personas/FK_011.png', mood: 'Clean Daily', tags: ['Clean', 'Comfort', 'Soft'], gender: 'female' },
  { id: 'FK_012', category: 'Feminine Korean', image: '/personas/FK_012.png', mood: 'Romantic Skirt', tags: ['Feminine', 'Soft', 'Romantic'], gender: 'female' },
  { id: 'FK_013', category: 'Feminine Korean', image: '/personas/FK_013.png', mood: 'MZ Daily 01', tags: ['Youth', 'Trendy', 'Urban'], gender: 'female' },
  { id: 'FK_014', category: 'Feminine Korean', image: '/personas/FK_014.png', mood: 'MZ Daily 02', tags: ['Active', 'Comfort', 'Practical'], gender: 'female' },
  { id: 'FK_015', category: 'Feminine Korean', image: '/personas/FK_015.png', mood: 'MZ Daily 03', tags: ['Clean', 'Minimal', 'Modern'], gender: 'female' },
  { id: 'FK_016', category: 'Feminine Korean', image: '/personas/FK_016.png', mood: 'MZ Daily 04', tags: ['Unique', 'Street', 'Active'], gender: 'female' },
  { id: 'FK_017', category: 'Feminine Korean', image: '/personas/FK_017.png', mood: 'MZ Daily 05', tags: ['Relaxed', 'Soft', 'Natural'], gender: 'female' },
  { id: 'F_36', category: 'Feminine Korean', image: '/personas/F_36.png', mood: 'Seongsu Chic', tags: ['Urban', 'Chic', 'Sophisticated'], gender: 'female' },
  { id: 'F_37', category: 'Feminine Korean', image: '/personas/F_37.png', mood: 'MZ Street', tags: ['Street', 'Night', 'Vibrant'], gender: 'female' },
  { id: 'F_38', category: 'Feminine Korean', image: '/personas/F_38.png', mood: 'Minimalist', tags: ['Minimal', 'Clean', 'Essential'], gender: 'female' },
  { id: 'F_41', category: 'Feminine Korean', image: '/personas/F_41.png', mood: 'Lovely Pink', tags: ['Feminine', 'Soft', 'Lovely'], gender: 'female' },
  { id: 'F_42', category: 'Feminine Korean', image: '/personas/F_42.png', mood: 'Lovely Yellow', tags: ['Bright', 'Cheerful', 'Soft'], gender: 'female' },
  { id: 'F_43', category: 'Feminine Korean', image: '/personas/F_43.jpeg', mood: 'Summer Shorts 01', tags: ['Active', 'Summer', 'Casual'], gender: 'female' },
  { id: 'F_44', category: 'Feminine Korean', image: '/personas/F_44.jpeg', mood: 'Summer Shorts 02', tags: ['Practical', 'Comfort', 'Summer'], gender: 'female' },
  { id: 'F_45', category: 'Feminine Korean', image: '/personas/F_45.jpeg', mood: 'Feminine Dress', tags: ['Feminine', 'Elegance', 'Soft'], gender: 'female' },
  { id: 'F_46', category: 'Feminine Korean', image: '/personas/F_46.jpeg', mood: 'Trendy Young Street', tags: ['Trendy', 'Youth', 'Street'], gender: 'female' },
  { id: 'UK_01', category: 'Urban semi-suit', image: '/personas/UK_01.png', mood: 'Dandy Semi-suit', tags: ['Urban', 'Formal', 'Clean'], gender: 'male' },
  { id: 'UK_02', category: 'Urban Korean', image: '/personas/UK_02.png', mood: 'Classic Casual', tags: ['Classic', 'Daily', 'Comfort'], gender: 'male' },
  { id: 'UK_03', category: 'Urban Korean', image: '/personas/UK_03.png', mood: 'Modern Look', tags: ['Modern', 'Urban', 'Minimal'], gender: 'male' },
  { id: 'UK_05', category: 'Urban semi-suit', image: '/personas/UK_05.png', mood: 'Modern Semi-suit', tags: ['Professional', 'Urban', 'Clean'], gender: 'male' },
  { id: 'UK_06', category: 'Urban Korean', image: '/personas/UK_06.png', mood: 'Layered Style', tags: ['Unique', 'Layered', 'Urban'], gender: 'male' },
  { id: 'UK_08', category: 'Urban Korean', image: '/personas/UK_08.png', mood: 'Relaxed Vacation', tags: ['Relaxed', 'Natural', 'Comfort'], gender: 'male' },
  { id: 'UK_09', category: 'Urban Korean', image: '/personas/UK_09.png', mood: '3040 Relaxed Knit', tags: ['Soft', 'Comfort', 'Sophisticated'], gender: 'male' },
  { id: 'UK_10', category: 'Urban Korean', image: '/personas/UK_10.png', mood: 'Layered Brown Shirt', tags: ['Urban', 'Casual', 'Classic'], gender: 'male' },
  { id: 'UK_11', category: 'Urban Korean', image: '/personas/UK_11.png', mood: 'Layered Denim Shirt', tags: ['Daily', 'Casual', 'Urban'], gender: 'male' },
  { id: 'M_33', category: 'Urban Korean', image: '/personas/M_33.png', mood: 'Street Cargo', tags: ['Street', 'Active', 'Cargo'], gender: 'male' },
  { id: 'M_34', category: 'Urban Korean', image: '/personas/M_34.png', mood: 'Graphic Cargo', tags: ['Unique', 'Graphic', 'Street'], gender: 'male' },
  { id: 'M_35', category: 'Urban semi-suit', image: '/personas/M_35.jpeg', mood: 'Semi-suit Look 01', tags: ['Formal', 'Urban', 'Modern'], gender: 'male' },
  { id: 'M_36', category: 'Urban semi-suit', image: '/personas/M_36.jpeg', mood: 'Semi-suit Look 02', tags: ['Clean', 'Professional', 'Modern'], gender: 'male' },
  { id: 'M_37', category: 'Urban Korean', image: '/personas/M_37.png', mood: 'Daily Casual Look', tags: ['Comfort', 'Daily', 'Urban'], gender: 'male' },
];
