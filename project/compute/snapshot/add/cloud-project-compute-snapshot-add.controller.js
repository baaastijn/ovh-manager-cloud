"use strict";

angular.module("managerApp")
  .controller("CloudProjectComputeSnapshotAddCtrl", function ($uibModalInstance, $translate, $filter, params, CloudMessage, OvhApiCloudProjectSnapshot, atInternet, CloudProjectComputeInfrastructureOrchestrator, CloudProjectComputeSnapshotPriceService) {
      var self = this;

      self.snapshot = {
          vm: params,
          name: [params.name, $filter("date")(new Date(), "short")].join(" ")
      };
      self.loaders = {
          backup: false
      };

      self.snapshotPriceStruct = {
          prices: [],
          size: params.flavor.disk,
          total: {}
      };

      self.backup = function () {
          self.loaders.backup = true;
          OvhApiCloudProjectSnapshot.v6().resetQueryCache();
          CloudProjectComputeInfrastructureOrchestrator.backupVm(self.snapshot.vm, self.snapshot.name).then(function () {
              CloudMessage.success($translate.instant("cpc_snapshot_add_success", { snapshotname: self.snapshot.name }));
              $uibModalInstance.close(self.snapshot);
              atInternet.trackOrder({
                  name: "[SNAPSHOT]" + self.snapshot.vm.flavor.groupName.replace(/[\W_]+/g, "") + "[" + self.snapshot.vm.flavor.groupName + "]",
                  page: "iaas::pci-project::compute::infrastructure::order",
                  priceTaxFree: self.snapshotPriceStruct.total.value
              });
          }, function (err) {
              CloudMessage.error([$translate.instant("cpc_snapshot_add_error"), err.data && err.data.message || ""].join(" "));
          }).finally(function () {
              self.loaders.backup = false;
          });
      };

      self.getPriceData = function () {
          CloudProjectComputeSnapshotPriceService.getSnapshotPrice({size : self.snapshotPriceStruct.size, serviceName : self.snapshot.vm.serviceName, region : self.snapshot.vm.region}).then(function (data) {
              self.snapshotPriceStruct.prices = [data];
              self.snapshotPriceStruct.total = data.totalPrice;
          });
      };

      self.cancel = function () {
          $uibModalInstance.dismiss(self.snapshot);
      };

      self.getPriceData();
  });
