import Daily from '../json/daily.json'

function DailyComp (){
    return(
        <div>
            {
                Daily.map (daily => {
                    return(
                        <div className='box' key={daily.id} style={{border: '1px solid black'}}> 
                            {daily.setor}<br/>
                            {daily.responsavel}<br/>
                            {daily.data}<br/>
                            {daily.horario}
                        </div>
                    )
                })
            }
        </div>
    ) };

export default DailyComp;