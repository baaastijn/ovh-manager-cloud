angular.module('managerApp')
  .service('CloudProjectBillingAgoraService',
    class {
      /* @ngInject */
      constructor(
        OvhApiCloudProject,
        OvhApiMeConsumption,
        OvhApiServiceRenewForecast,
      ) {
        this.OvhApiCloudProject = OvhApiCloudProject;
        this.OvhApiMeConsumption = OvhApiMeConsumption;
        this.OvhApiServiceRenewForecast = OvhApiServiceRenewForecast;
      }

      getIfProjectUsesAgora(serviceName) {
        return this.OvhApiCloudProject.v6().get({ serviceName }).$promise
          .then(({ planCode }) => planCode !== 'project.legacy' && planCode !== 'project.2018');
      }

      getProjectServiceInfos(serviceName) {
        return this.OvhApiCloudProject.ServiceInfos().v6().get({ serviceName }).$promise;
      }

      getCurrentForecast(serviceId) {
        return this.OvhApiMeConsumption.Usage().Forecast().v6().get().$promise
          .then(forecast => _.find(forecast, { serviceId }));
      }

      getCurrentConsumption(serviceId) {
        return this.OvhApiMeConsumption.Usage().Current().v6().get().$promise
          .then(consumption => _.find(consumption, { serviceId }));
      }

      getBillForecast(serviceId) {
        return this.OvhApiServiceRenewForecast.v6()
          .get({ serviceId, includeOptions: true }).$promise;
      }
    });
