import React from 'react'
import {useState} from 'react'
import {DriverWithKartAndGroup} from './../model/DriverWithKartAndGroup'
import {
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TableCell,
  TableBody, makeStyles,
} from '@material-ui/core'
import {generate, generateForRace, getGroupsCount} from './../core/generator'


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  addMargin: {
    margin: 10,
    scroll: 'auto'
  },
  hideWhenPrint: {
    [`@media print`]: {
      display: 'none',
    },
    textAlign: 'center',
  },
});

export default function KartGenerator() {
  const classes = useStyles();

  const [drivers, setDrivers] = useState<string[]>([])
  const [data, setData] = useState<DriverWithKartAndGroup[]>([])
  const [karts, setKarts] = useState<string[]>([])
  const [driversInGroups, setDriversInGroups] = useState<string[][]>([])
  return (<>
    <div className={classes.hideWhenPrint}>
      <div>
        <TextField
          className={classes.addMargin}
          id="drivers"
          label="Пилоты"
          variant="outlined"
          minRows={10}
          multiline={true}
          value={drivers.join('\n')}
          onChange={(value) => setDrivers(value.target.value.split('\n'))}
        />
        <TextField
          className={classes.addMargin}
          id="karts"
          label="Карты"
          variant="outlined"
          multiline={true}
          minRows={10}
          value={karts.join('\n')}
          onChange={(value) => setKarts(value.target.value.split('\n'))}
        />
        { driversInGroups.length > 1 &&
          driversInGroups.map((value, index) =>
              <TextField
                className={classes.addMargin}
                key={`Group${index}`}
                label={`Группа ${index + 1}`}
                variant="outlined"
                multiline={true}
                minRows={10}
                value={value.join('\n')}
                onChange={(value) => {
                  const result = driversInGroups.map(value => [...value])
                  result[index] = value.target.value.split('\n')
                  setDriversInGroups(result)
                }}
              />
          )
        }

      </div>
      <Button
        className={classes.addMargin}
        color="primary"
        variant="contained"
        onClick={() => {
          const kartsWithoutBlank = removeBlankValues(karts)
          const driversWithoutBlank = removeBlankValues(drivers)
          setData(generate(driversWithoutBlank, kartsWithoutBlank))
          const newDriversGroups = []
          for (let i = 0; i < getGroupsCount(driversWithoutBlank, kartsWithoutBlank); i++) {
            newDriversGroups.push([])
          }
          setDriversInGroups(newDriversGroups)
          return false
        }}
      >
        Генерировать
      </Button>
      {driversInGroups.length > 1 &&
        <Button
          className={classes.addMargin}
          color="primary"
          variant="contained"
          onClick={() => {
            const kartsWithoutBlank = removeBlankValues(karts)
            const driversWithoutBlank = driversInGroups.map(value => removeBlankValues(value))
            setData(generateForRace([...data], driversWithoutBlank, kartsWithoutBlank))
            return false
          }}
        >
          Генерировать для гонки
        </Button>
      }
    </div>
    {data.length > 0 &&
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Пилот</TableCell>
              <TableCell align="right">Группа</TableCell>
              <TableCell align="right">Квалификация</TableCell>
              <TableCell align="right">Гонка</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.driver}>
                <TableCell component="th" scope="row">
                  {row.driver}
                </TableCell>
                <TableCell align="right">{row.group}</TableCell>
                <TableCell align="right">{row.kartQualification}</TableCell>
                <TableCell align="right">{row.kartRace}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    }
  </>)
}

function removeBlankValues(value: string[]) {
  const result = [...value]
  while (result[result.length - 1] === '') {
    result.pop()
  }
  return result

}