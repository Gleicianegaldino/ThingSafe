import Annual from '../json/annual.json'

function AnnualComp (){
    return(
        <div>
            {
                Annual.map (annual => {
                    return(
                        <div className='box' key={annual.id} style={{border: '1px solid black'}}> 
                            {annual.setor}<br/>
                            {annual.responsavel}<br/>
                            {annual.data}<br/>
                            {annual.horario}
                        </div>
                    )
                })
            }
        </div>
    ) };

export default AnnualComp;