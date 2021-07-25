import React from 'react'
import {useState} from 'react'
import axios from 'axios'
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
import {properties} from './../properties'


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
  return (<>
    <form
      onSubmit={(event) => {
        axios.post(properties.host + '/api/kart/generate', {drivers: drivers, karts: karts})
          .then((value) => {
            setData(value.data)
            console.log(value.data)
          })
        event.stopPropagation()
        event.preventDefault()
        return false
      }}
      className={classes.hideWhenPrint}
    >
      <div>
        <div>
          <TextField className={classes.addMargin} id="drivers" label="Пилоты" variant="outlined" minRows={10} multiline={true} value={drivers.join('\n')} onChange={(value) => setDrivers(value.target.value.split('\n'))}/>
          <TextField className={classes.addMargin} id="karts" label="Карты" variant="outlined" multiline={true} minRows={10} value={karts.join('\n')} onChange={(value) => setKarts(value.target.value.split('\n'))}/>
        </div>
        <Button className={classes.addMargin} color="primary" variant="contained" type="submit">Generate</Button>
      </div>
    </form>
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