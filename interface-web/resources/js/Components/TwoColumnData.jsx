export default function ThreeColumnData({ data }) {
    return (
        <div className="flex flex-row">
            <div className="flex-1">
                {data[0] && (
                    <div className="p-4 bg-white rounded-lg mb-4">
                        {data[0]}
                    </div>
                )}
            </div>
            <div className="flex-1">
                {data[1] && (
                    <div className="p-4 bg-white rounded-lg mb-4">
                        {data[1]}
                    </div>
                )}
            </div>
        </div>
    );
}
