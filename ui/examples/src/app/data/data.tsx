import { faker } from '@faker-js/faker';
 
export type Person = {
  id: number;
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  createdAt: Date,
  description?: string,

  dob?: Date | null,
  
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
  }
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (index: number): Person => {
  return {
    id: index + 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ max: 40 }),
    visits: faker.number.int({ max: 1000 }),
    progress: faker.number.int({ max: 100 }),
    createdAt: faker.date.between({ from: new Date("01/01/1950"), to: new Date() }),
    status: faker.helpers.shuffle<Person['status']>([
      'relationship',
      'complicated',
      'single',
    ])[0],

    // get date with some empty values
    dob: faker.helpers.arrayElement([
      faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
      undefined,
      null,
    ]),

    address : { 
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    }
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth];
    if (!len) {
      return [];
    }
    return range(len).map((d): Person => {
      return {
        ...newPerson(d),
      }
    })
  }

  return makeDataLevel()
}
