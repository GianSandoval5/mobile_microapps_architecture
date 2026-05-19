import {createAuthModule} from '../packages/auth_module';
import {FakeEnterpriseGateway} from '../packages/core_network';
import {createInsuranceModule} from '../packages/insurance_module';
import {ModuleRegistry} from '../packages/module_contracts';
import {createPaymentsModule} from '../packages/payments_module';
import {createProfileModule} from '../packages/profile_module';

import {AppSessionController} from './AppSessionController';

export class DemoCompositionRoot {
  readonly session = new AppSessionController();
  readonly network = new FakeEnterpriseGateway();
  readonly registry = new ModuleRegistry([
    createAuthModule({session: this.session, network: this.network}),
    createPaymentsModule({session: this.session, network: this.network}),
    createInsuranceModule({session: this.session, network: this.network}),
    createProfileModule({session: this.session}),
  ]);
}
