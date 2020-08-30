import React from 'react';
import ReactDOM from 'react-dom';
import styles from './create_board.module.css';
import axios from 'axios';
import Loader from 'react-loader-spinner';
// import { MDBSpinner } from 'mdbreact';
// import 'bootstrap';
import { TreeView, processTreeViewItems, handleTreeViewCheckChange, moveTreeViewItem, TreeViewDragAnalyzer, TreeViewDragClue } from '@progress/kendo-react-treeview'
import '@progress/kendo-react-animation'


    const SEPARATOR = '_';
    class create_board extends React.Component{
        constructor(props){
            super(props);
            this.state={
                tree: [],
                tree2: [],
                boardList:[],
                loading: false
            };                     
        }
        treeView1Guid;
        treeView2Guid;
        dragClue;
        dragOverCnt = 0;
        isDragDrop = false;

        // state = { tree, tree2, boardList };
        treeData2=[];
        treeData=[];
        boardsList = [];
        rackId="";
        rackName="";
        componentDidMount(){
            const headers = {
            }
            this.setState({loading:true})
            axios.get('api_url_call here',{
                headers:headers
            }).then(boards => {
                this.setState({loading:false})
                if(boards.data.status===1){
                    this.boardsList = boards.data.object;
                    this.setState({boardList:this.boardsList});
                }
            })
        }

        boardPreview(rackId,boardName){
            this.rackName = boardName;

            this.rackId="";
            const headers = { }
            const curriculumBoardPostDto  ={
                "boardId":rackId,
                "languageId":"1"
            }
            this.setState({loading:true})
            axios.post('api_url_call here',curriculumBoardPostDto,{
                headers: headers
              }).then(res => {
                  this.setState({loading:false});
                  if(res.data.status===1){
                    this.rackId = rackId;
                  const data = res.data.object;
                  if(data[0] != null) {
                    this.treeData2 = [this.treeTraverse(data[0],1)];
                    this.treeData = [this.treeTraverse(data[0],1)];
                  }
                  this.setState({tree:this.treeData2});
                  this.setState({tree2:this.treeData})
                }                  
            })
        }


        treeTraverse(data, i) {
            let params ;
             if(data['children'] && data['children'].length > 0){
                params = {
                    text: data['rackName'],
                    expanded: i > 0 ? true : false,
                    items: []
                }
             }else{
                params = {
                    text: data['rackName']
                }
             }
            
            if(data['children']  && data['children'].length > 0){
                data['children'].forEach((nest)=>{
                    params['items'].push(this.treeTraverse(nest, i - 1));

                });
            }

            return params;
           
        }
            



        render() {
            return (
                <div className={styles.create_board}>
                   <div className={styles.Table}>
                        <div  className={styles.Heading}>
                            <div className={styles.HeadCell}>
                                <p>S. No</p>
                            </div>
                            
                            <div className={styles.HeadCell}>
                                <p>Board Name</p>
                            </div>
                                                
                            <div className={styles.HeadCell}>
                                <p>Preview</p>
                            </div>

                        </div>
                    { this.state.boardList.map((boards,i) => {
                       return ( 
                       <div className={styles.Row} >
                            <div className={styles.Cell}>
                                <p>{i+1}</p>
                            </div>
                            
                            <div className={styles.Cell}>
                                <p>{boards.boardName}</p>
                            </div>

                            <div className={styles.Cell}>
                                <p><a href="javascript:void(0)" onClick={ () => this.boardPreview(boards.rackId,boards.boardName)} className={styles.preview}>preview</a></p>
                            </div>

                        </div>
                       )
                    })}
                </div>

                    <div className={styles.treeview}>
                    <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        visible={this.state.loading}
                        />
                        {this.rackId?(

                    <div>
                       
                        <h5 className={styles.board_preview}>Board Name: {this.rackName}</h5>
                    <div className="row" className={styles.tree}>
                    {/* <MDBSpinner /> */}
                    <div className="col-xs-6" className={styles.tree_border_left} >
                            <TreeView data={this.state.tree}
                                draggable={true} onItemDragOver={this.onItemDragOver} onItemDragEnd={this.onItemDragEnd}
                                ref={treeView => this.treeView1Guid = treeView && treeView.guid}
                                expandIcons={true} onExpandChange={this.onExpandChange} onItemClick={this.onItemClick}
                            />
                    </div>
                    <div className="col-xs-6"  className={styles.tree_border_right}>
                            <TreeView data={this.state.tree2}
                                draggable={true} onItemDragOver={this.onItemDragOver} onItemDragEnd={this.onItemDragEnd}
                                ref={treeView => this.treeView2Guid = treeView && treeView.guid}
                                expandIcons={true} onExpandChange={this.onExpandChange} onItemClick={this.onItemClick}
                            />
                    </div>
                    <TreeViewDragClue ref={dragClue => this.dragClue = dragClue} />
                    </div>
                    </div>
                        ):(<div></div>)}
                    </div>
                </div>
            );
        }

        onItemDragOver = (event) => {
            this.dragOverCnt++;
            this.dragClue.show(event.pageY + 10, event.pageX, event.item.text, this.getClueClassName(event));
        }
        onItemDragEnd = (event) => {
            this.isDragDrop = this.dragOverCnt > 0;
            this.dragOverCnt = 0;
            this.dragClue.hide();

            const eventAnalyzer = new TreeViewDragAnalyzer(event).init();

            if (eventAnalyzer.isDropAllowed) {
                const { sourceData, targetData } = moveTreeViewItem(
                    event.itemHierarchicalIndex,
                    this.resolveData(event.target.guid),
                    eventAnalyzer.getDropOperation(),
                    eventAnalyzer.destinationMeta.itemHierarchicalIndex,
                    this.resolveData(eventAnalyzer.destinationMeta.treeViewGuid)
                );

                this.setState({
                    [this.resolveDataKey(event.target.guid)]: sourceData,
                    [this.resolveDataKey(eventAnalyzer.destinationMeta.treeViewGuid)]: targetData
                });
            }
        }
        onItemClick = (event) => {
            if (!this.isDragDrop) {
                event.item.selected = !event.item.selected;
                this.forceUpdate();
            }
        }
        onExpandChange = (event) => {
            event.item.expanded = !event.item.expanded;
            this.forceUpdate();
        }

        getClueClassName(event) {
            const eventAnalyzer = new TreeViewDragAnalyzer(event).init();
            const { itemHierarchicalIndex: itemIndex, treeViewGuid } = eventAnalyzer.destinationMeta;

            if (eventAnalyzer.isDropAllowed) {
                switch (eventAnalyzer.getDropOperation()) {
                    case 'child':
                        return 'k-i-plus';
                    case 'before':
                        return itemIndex === '0' || itemIndex.endsWith(`${SEPARATOR}0`) ?
                            'k-i-insert-up' : 'k-i-insert-middle';
                    case 'after':
                        const siblings = getSiblings(itemIndex, this.resolveData(treeViewGuid));
                        const lastIndex = Number(itemIndex.split(SEPARATOR).pop());

                        return lastIndex < siblings.length - 1 ? 'k-i-insert-middle' : 'k-i-insert-down';
                    default:
                        break;
                }
            }

            return 'k-i-cancel';
        }
        resolveData(treeViewGuid) {
            return treeViewGuid === this.treeView1Guid ? this.state.tree : this.state.tree2;
        }
        resolveDataKey(treeViewGuid) {
            return treeViewGuid === this.treeView1Guid ? 'tree' : 'tree2';
        }
    }

    function getSiblings(itemIndex, data) {
        let result = data;

        const indices = itemIndex.split(SEPARATOR).map(index => Number(index));
        for (let i = 0; i < indices.length - 1; i++) {
            result = result[indices[i]].items;
        }

        return result;
    }

    

export default create_board;
