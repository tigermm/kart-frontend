import {DriverWithKartAndGroup} from './../model/DriverWithKartAndGroup'

export function generate(drivers: string[], karts: string[]): DriverWithKartAndGroup[] {
  const result: DriverWithKartAndGroup[] = []
  const indexes: Comparable[] = []
  drivers.forEach((value, index) => {
    result.push({driver: value, kartQualification: null, kartRace: null, group: null})
    indexes.push({value: index, weight: Math.random() * drivers.length})
  })
  indexes.sort(comparator)
  const groups = getGroupsCount(drivers, karts)

  const driversInGroupDefault = drivers.length / groups;
  for (let i = 1; i <= groups; i++) {
    const kartsForQualification = [...karts].map(value => ({value: value, weight: Math.random() * karts.length})).sort(comparator).map(value => value.value);
    const kartsForRace = [...karts].map(value => ({value: value, weight: Math.random() * karts.length})).sort(comparator).map(value => value.value);
    const driversInGroup = i === groups ? Math.floor(drivers.length - (driversInGroupDefault * (i - 1))) : driversInGroupDefault;
    for (let j = 0; j < driversInGroup; j++) {
      const driver = result[indexes.pop()!!.value];
      driver.group = i;
      driver.kartQualification = kartsForQualification.pop()!!
      if (kartsForQualification.length === 1) {
        const lastElementIndex = kartsForRace.indexOf(kartsForQualification[0])
        driver.kartRace = lastElementIndex !== -1? kartsForRace.slice(lastElementIndex, lastElementIndex + 1)[0]: getRaceKart(kartsForRace, driver.kartQualification)
      } else {
        driver.kartRace = getRaceKart(kartsForRace, driver.kartQualification)
      }
    }
  }
  return result
}

export function generateForRace(drivers: DriverWithKartAndGroup[], driversInGroups: string[][], karts: string[]): DriverWithKartAndGroup[] {
  driversInGroups.forEach((value, index) => {
    const kartsForRace = [...karts].map(data => ({value: data, weight: Math.random() * karts.length})).sort(comparator).map(data => data.value);
    value.forEach(driver => {
      const result = drivers.filter(d => d.driver === driver)[0]
      result.group = index + 1
      result.kartRace = getRaceKart(kartsForRace, result.kartQualification!!)
    })
  })
  return drivers
}

function getRaceKart(kartsForRace: string[], qualifyingKart: string) {
  return kartsForRace[kartsForRace.length - 1] === qualifyingKart ? kartsForRace.shift()!! : kartsForRace.pop()!!
}

export function getGroupsCount(drivers: string[], karts: string[]): number {
  let groups = drivers.length > karts.length? Math.floor(drivers.length / karts.length): 1
  if (groups*karts.length < drivers.length) {
    groups++
  }
  return groups
}

interface Comparable {
  value: any,
  weight: number
}

const comparator = function (a: Comparable, b: Comparable) {
  if (a.weight > b.weight) {
    return 1
  } else {
    return a.weight < b.weight? -1 : 0
  }
}