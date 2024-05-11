import React, { Component } from 'react';
import AppStateContext from '../../../utils/AppStateContext';

class TableInputForm extends Component {

    static contextType = AppStateContext
    constructor(props) {
        super(props);
        this.state = {
            numCols: 3,
            tableData: [],
        };
    }

    handleNumColsChange = (e) => {
        this.setState({ numCols: parseInt(e.target.value) });
    };

    handleAddRow = () => {
        const { numCols, tableData } = this.state;
        this.setState({ tableData: [...tableData, Array(numCols).fill('')] });
    };

    handleRemoveRow = (index) => {
        const { tableData } = this.state;
        let remove = tableData.filter((_, i) => i !== index)
        this.setState({ tableData: remove });

        const { setBlogTableData } = this.context
        setBlogTableData({ data: remove, id: this.props.tableId.id })
    };

    handleCellChange = (rowIndex, colIndex, value) => {

        // Check if value contains both anchor and bold structures
        const hasAnchor = value.includes("[") && value.includes("]");
        const hasBold = value.includes("*");

        // Convert anchor structure
        if (hasAnchor) {
            value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
            value = value.replace(/\\+([^"]+)\\"/g, '$1');
        }

        // Convert bold structure
        if (hasBold) {
            value = value.replace(/\*(.*?)\*/g, '<b>$1</b>');
        }
        const { tableData } = this.state;
        const updatedTableData = tableData.map((row, i) => {
            if (i === rowIndex) {
                return row.map((cell, j) => {
                    if (j === colIndex) {
                        return value;
                    } else {
                        return cell;
                    }
                });
            } else {
                return row;
            }
        });
        this.setState({ tableData: updatedTableData });

        const allCellData = updatedTableData.reduce((acc, row) => {
            row.forEach(cell => acc.push(cell));
            return acc;
        }, []);

        const { setBlogTableData } = this.context
        setBlogTableData({ data: allCellData, id: this.props.tableId.id, colm: this.state.numCols })

    };
    componentDidMount() {
        this.setState({ numCols: parseInt(this.props.tableId.colm) })
        for (let i = 0; i < this.props.tableId.content.length; i += parseInt(this.props.tableId.colm)) {
            this.state.tableData.push(this.props.tableId.content.slice(i, i + parseInt(this.props.tableId.colm)));
        }
    }

    render() {
        const { numCols, tableData } = this.state;

        return (
            <div className="container mx-auto">
                <div className="flex space-x-4 mb-4 items-center mt-4">
                    <input type="number" value={numCols} onChange={this.handleNumColsChange} min="1" placeholder='col' className="w-16 h-8 border border-gray-300 rounded" />
                </div>
                <table className="table-auto w-full">
                    <tbody>
                        {tableData.map((row, rowIndex) => (
                            <tr key={rowIndex} className=''>
                                {row.map((cell, colIndex) => (
                                    <td key={colIndex} className=' p-2'>
                                        <textarea rows={3} value={cell} onChange={(e) => this.handleCellChange(rowIndex, colIndex, e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md" />
                                    </td>
                                ))}
                                <td className='flex items-center p-2'>
                                    <button onClick={() => this.handleRemoveRow(rowIndex)} className="w-5 h-5 text-xs bg-gray-500 text-white rounded-full">
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='flex gap-x-4'>
                    <button onClick={this.handleAddRow} className="mt-5 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded">
                        +
                    </button>
                </div>
            </div>
        );
    }
}

export default TableInputForm;

