import Monthly from '../json/monthly.json'

function MonthlyComp (){
    return(
        <div>
            {
                Monthly.map (monthly => {
                    return(
                        <div className='box' key={monthly.id} style={{border: '1px solid black'}}> 
                            {monthly.setor}<br/>
                            {monthly.responsavel}<br/>
                            {monthly.data}<br/>
                            {monthly.horario}
                        </div>
                    )
                })
            }
        </div>
    ) };

export default MonthlyComp;