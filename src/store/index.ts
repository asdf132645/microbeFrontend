// index.vue
import {createStore} from "vuex";
import {userModule} from "@/store/modules/userModule";
import {executeModule} from '@/store/modules/analysis/executeModule';
import {workingViewModule} from '@/store/modules/analysis/workingViewModule';
import { embeddedStatusModule } from '@/store/modules/embeddedStatusModule';
import { orderListModule } from '@/store/modules/analysis/orderListModule';
import { runningInfoModule } from '@/store/modules/testPageCommon/ruuningInfo';
import {commonModule} from "@/store/modules/commonModule";
import {dataBaseSetDataModule} from "@/store/modules/dataBaseSetData/dataBaseSetDataModule";
import {timeModule} from "@/store/modules/timeModule";
// import createPersistedState from 'vuex-persistedstate';


const store = createStore({
    modules: {
        userModule,
        executeModule,
        // rbcClassificationModule,
        // wbcClassificationModule,
        workingViewModule,
        embeddedStatusModule,
        orderListModule,
        runningInfoModule,
        commonModule,
        dataBaseSetDataModule,
        timeModule,
    }

});

export default store;

const ts = [
    {
        "id": "0",
        "name": "AR_PB-0036_001_000.bmp",
        "classInfo": [
            {
              "count": "24",
              "classNm": "WBC",
              "afterGrade": "Moderate",
              "beforeGrade": "Moderate"
            },
            {
                "count": "0",
                "classNm": "Yeast",
                "afterGrade": "None",
                "beforeGrade": "None"
            }
        ]
    },
    {
        "id": "1",
        "name": "AR_PB-0036_001_000.bmp",
        "classInfo": [
            {
                "count": "10",
                "classNm": "GPC",
                "afterGrade": "Few",
                "beforeGrade": "Few"
            },
            {
                "count": "4",
                "classNm": "GNB",
                "afterGrade": "Rare",
                "beforeGrade": "Rare"
            },
            {
                "count": "2",
                "classNm": "GPB",
                "afterGrade": "Rare",
                "beforeGrade": "Rare"
            }
        ]
    },
    {
        "id": "0",
        "name": "AR_PB-0036_004_000.bmp",
        "classInfo": [
            {
                "count": "44",
                "classNm": "WBC",
                "afterGrade": "Moderate",
                "beforeGrade": "Many"
            },
            {
                "count": "1",
                "classNm": "Yeast",
                "afterGrade": "None",
                "beforeGrade": "Exist"
            }
        ]
    },
    {
        "id": "1",
        "name": "AR_PB-0036_004_000.bmp",
        "classInfo": [
            {
                "count": "10",
                "classNm": "GPC",
                "afterGrade": "Few",
                "beforeGrade": "Moderate"
            },
            {
                "count": "4",
                "classNm": "GNB",
                "afterGrade": "Rare",
                "beforeGrade": "Many"
            },
            {
                "count": "2",
                "classNm": "GPB",
                "afterGrade": "Rare",
                "beforeGrade": "Few"
            }
        ]
    },
    {
        "id": "2",
        "classInfo": [
            {
                "count": "47",
                "classNm": "WBC",
                "afterGrade": "Moderate",
                "beforeGrade": "Many"
            },
            {
                "count": "1",
                "classNm": "Yeast",
                "afterGrade": "Exist",
                "beforeGrade": "Exist"
            },
            {
                "count": "24",
                "classNm": "GPC",
                "afterGrade": "Few",
                "beforeGrade": "Moderate"
            },
            {
                "count": "43",
                "classNm": "GNB",
                "afterGrade": "Rare",
                "beforeGrade": "Many"
            },
            {
                "count": "2",
                "classNm": "GPB",
                "afterGrade": "Rare",
                "beforeGrade": "Few"
            }
        ]
    }
]
