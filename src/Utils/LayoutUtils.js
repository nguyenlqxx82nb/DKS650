
import {LayoutProvider} from 'recyclerlistview';
import Utils from './Utils.js'

const columnWidth = (Utils.Width() - 10*2-5*2)/3;
export default class LayoutUtils {
    static getLayoutProvider(type){
        return new LayoutProvider(
            () => {
              return 'FULL'; //Since we have just one view type
            },
            (type, dim, index) => {
                dim.width = columnWidth;
                dim.heigh = columnWidth*4/3;
            }
          );
    }
}