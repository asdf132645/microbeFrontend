// index.vue
import {createStore} from "vuex";
import {userModule} from "@/store/modules/userModule";
import {executeModule} from '@/store/modules/analysis/executeModule';
import {workingViewModule} from '@/store/modules/analysis/workingViewModule';
import { embeddedStatusModule } from '@/store/modules/embeddedStatusModule';
import { orderListModule } from '@/store/modules/analysis/orderListModule';
import {commonModule} from "@/store/modules/commonModule";
import {timeModule} from "@/store/modules/timeModule";


const store = createStore({
    modules: {
        userModule,
        executeModule,
        workingViewModule,
        embeddedStatusModule,
        orderListModule,
        commonModule,
        timeModule,
    }

});

export default store;