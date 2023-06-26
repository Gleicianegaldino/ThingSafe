import Weekly from '../json/weekly.json'

function WeeklyComp (){
    return(
        <div>
            {
                Weekly.map (weekly => {
                    return(
                        <div className='box' key={weekly.id} style={{border: '1px solid black'}}> 
                            {weekly.setor}<br/>
                            {weekly.responsavel}<br/>
                            {weekly.data}<br/>
                            {weekly.horario}
                        </div>
                    )
                })
            }
        </div>
    ) };

export default WeeklyComp;