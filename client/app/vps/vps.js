export const vpsHeader = {
  templateUrl: 'app/vps/vps-header.html',
  controller: 'VpsHeaderCtrl',
  controllerAs: '$ctrl',
};

export default { vpsHeader };

angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('iaas.vps', {
      url: '/vps',
      templateUrl: 'app/vps/vps.html',
      abstract: true,
      translations: {
        value: ['../common', '../vps'],
        format: 'json',
      },
    })
    .state('iaas.vps.detail', {
      url: '/{serviceName}',
      redirectTo: 'iaas.vps.detail.dashboard',
      resolve: {
        stateVps: ($transition$, $q, OvhApiVps) => OvhApiVps.v6().get({
          serviceName: _.get($transition$.params(), 'serviceName'),
        }).$promise
          .catch((error) => {
            if (error.status === 404) {
              return $q.reject(_.merge({ code: 'LOADING_STATE_ERROR' }, error));
            }
            return true;
          }),
      },
      views: {
        vpsHeader,
        vpsContainer: {
          templateUrl: 'app/vps/vps-detail.html',
          controller: 'VpsDetailCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.dashboard', {
      url: '/dashboard',
      views: {
        vpsContent: {
          templateUrl: 'app/vps/dashboard/vps-dashboard.html',
          controller: 'VpsDashboardCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.secondary-dns', {
      url: '/secondary-dns',
      views: {
        vpsContent: {
          templateUrl: 'app/vps/secondary-dns/vps-secondary-dns.html',
          controller: 'VpsSecondaryDnsCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.backup-storage', {
      url: '/backup-storage',
      redirectTo: 'iaas.vps.detail.backup-storage.list',
      views: {
        vpsContent: {
          template: '<div data-ui-view="vpsBackupStorageContent"></div>',
        },
      },
    })
    .state('iaas.vps.detail.backup-storage.list', {
      url: '/',
      views: {
        vpsBackupStorageContent: {
          templateUrl: 'app/vps/backup-storage/vps-backup-storage.html',
          controller: 'VpsBackupStorageCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.backup-storage.order', {
      url: '/order',
      views: {
        vpsBackupStorageContent: {
          templateUrl: 'app/vps/backup-storage/order/vps-order-backup-storage.html',
          controller: 'VpsOrderBackupStorageCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.veeam', {
      url: '/veeam',
      redirectTo: 'iaas.vps.detail.veeam.list',
      views: {
        vpsContent: {
          template: '<div data-ui-view="vpsVeeamContent"></div>',
        },
      },
    })
    .state('iaas.vps.detail.veeam.list', {
      url: '/',
      views: {
        vpsVeeamContent: {
          templateUrl: 'app/vps/veeam/vps-veeam.html',
          controller: 'VpsVeeamCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.veeam.order', {
      url: '/order',
      views: {
        vpsVeeamContent: {
          templateUrl: 'app/vps/veeam/order/vps-order-veeam.html',
          controller: 'VpsOrderVeeamCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.cloud-database', {
      url: '/cloud-database',
      redirectTo: 'iaas.vps.detail.cloud-database.list',
      views: {
        vpsContent: {
          template: '<div ui-view="vpsCloudDatabaseContent"></div>',
        },
      },
      resolve: {
        shouldNotBeCA: [
          '$q',
          'FeatureAvailabilityService',
          ($q, FeatureAvailabilityService) => FeatureAvailabilityService
            .hasFeaturePromise('VPS', 'cloudDatabase')
            .then(hasFeature => (hasFeature ? $q.when() : $q.reject('Not authorized'))),
        ],
      },
    })
    .state('iaas.vps.detail.cloud-database.list', {
      url: '/',
      views: {
        vpsCloudDatabaseContent: {
          templateUrl: 'app/vps/cloud-database/vps-cloud-database.html',
          controller: 'VpsCloudDatabaseCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.cloud-database.order', {
      url: '/order',
      views: {
        vpsCloudDatabaseContent: {
          templateUrl: 'app/vps/cloud-database/order/vps-cloud-database-order.html',
          controller: 'VpsCloudDatabaseOrderCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.monitoring', {
      url: '/monitoring',
      views: {
        vpsContent: {
          templateUrl: 'app/vps/monitoring/vps-monitoring.html',
          controller: 'VpsMonitoringCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.snapshot-order', {
      url: '/snapshot-order',
      views: {
        vpsHeader,
        vpsContent: {
          templateUrl: 'app/vps/snapshot-order/vps-snapshot-order.html',
          controller: 'VpsOrderSnapshotCtrl',
          controllerAs: '$ctrl',
        },
      },
    })
    .state('iaas.vps.detail.windows-order', {
      url: '/windows-order',
      views: {
        vpsHeader,
        vpsContent: {
          templateUrl: 'app/vps/windows-order/vps-windows-order.html',
          controller: 'VpsOrderWindowsCtrl',
          controllerAs: '$ctrl',
        },
      },
    });
});
