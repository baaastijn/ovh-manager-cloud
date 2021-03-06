class LogsIndexCtrl {
  constructor($stateParams, bytesFilter, CucCloudMessage, CucControllerHelper, LogsIndexService,
    LogsConstants) {
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsIndexService = LogsIndexService;
    this.LogsConstants = LogsConstants;
    this.suffixPattern = this.LogsConstants.suffixPattern;
    this.bytesFilter = bytesFilter;
    this.initLoaders();
  }

  initLoaders() {
    this.indexOptions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsIndexService.getSubscribedOptions(this.serviceName),
    });

    this.quota = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.LogsIndexService.getQuota(this.serviceName),
    });

    this.indices = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsIndexService.getIndices(this.serviceName),
    });

    this.quota.load();
    this.indices.load();
    this.indexOptions.load();
  }

  add(info) {
    this.CucCloudMessage.flushChildMessage();
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/dbaas/logs/detail/index/add/logs-index-add.html',
        controller: 'LogsIndexAddModalCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        resolve: {
          serviceName: () => this.serviceName,
          indexInfo: () => info,
          options: () => this.indexOptions,
          quota: () => this.quota,
        },
      },
    }).then(() => {
      this.initLoaders();
    });
  }

  storageColor(info) {
    const percentage = parseInt((info.currentStorage * 100) / info.maxSize, 10);
    if (percentage >= 80) {
      return `oui-status_${this.LogsConstants.indexStorage.error}`;
    } if (percentage < 60) {
      return `oui-status_${this.LogsConstants.indexStorage.success}`;
    } if (percentage >= 60 && percentage < 80) {
      return `oui-status_${this.LogsConstants.indexStorage.warning}`;
    }
    return null;
  }

  showDeleteConfirm(info) {
    this.CucCloudMessage.flushChildMessage();
    this.LogsIndexService.deleteModal(
      info.name,
    ).then(() => {
      this.delete = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () => this.LogsIndexService.deleteIndex(this.serviceName, info)
          .then(() => this.initLoaders())
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
      });

      this.delete.load();
    });
  }
}

angular.module('managerApp').controller('LogsIndexCtrl', LogsIndexCtrl);
