

angular.module('managerApp')
  .constant('CLOUD_INSTANCE_DEFAULTS', {
    region: 'WAW1',
    image: 'Ubuntu 16.04',
    flavor: 'b2-30',
  })
  .constant('CLOUD_INSTANCE_DEFAULT_FALLBACK', {
    region: 'WAW1',
    image: 'Ubuntu 16.04',
    flavor: 's1-2',
  })
  .constant('CLOUD_FLAVORTYPE_CATEGORY', [
    {
      id: 'balanced',
      types: ['ovh.ceph.eg', 'ovh.ssd.eg'],
      migrationNotAllowed: ['vps'],
      order: 1,
    },
    {
      id: 'cpu',
      types: ['ovh.cpu', 'ovh.ssd.cpu', 'ovh.ceph.hg'],
      migrationNotAllowed: ['vps'],
      order: 2,
    },
    {
      id: 'ram',
      types: ['ovh.ram', 'ovh.ssd.ram'],
      migrationNotAllowed: ['vps'],
      order: 3,
    },
    {
      id: 'accelerated',
      types: ['ovh.ssd.gpu', 'ovh.ssd.gpu2', 'ovh.ssd.gpu3', 'ovh.ssd.fpga2', 'ovh.raid-nvme.t1'],
      migrationNotAllowed: ['vps'],
      order: 4,
    },
    {
      id: 'vps',
      types: ['ovh.vps-ssd'],
      migrationNotAllowed: [],
      order: 5,
    },
  ])
  .constant('CLOUD_FLAVOR_SPECIFIC_IMAGE', [
    'g1',
    'g2',
    'g3',
    't1',
  ])
  .constant('CLOUD_INSTANCE_CPU_FREQUENCY', {
    'ovh.vps-ssd': 2.4,
    'ovh.cpu': 3.1,
    'ovh.ram': 2.4,
    'ovh.ceph.eg': 2.3,
    'ovh.ssd.ram': 2.4,
    'ovh.ssd.cpu': 3.1,
    'ovh.ssd.eg': 2.3,
    'ovh.ssd.gpu': 3.1,
    'ovh.ssd.gpu2': 3.1,
    'ovh.ssd.gpu3': 3.1,
    'ovh.raid-nvme.t1': 2.1,
  })
  .constant('CLOUD_INSTANCE_NUMBER_OF_GPUS', {
    default: 1,
    120: 3,
    45: 1,
    90: 2,
  })
  .constant('CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES', [
    'balanced',
    'ram',
    'cpu',
    'accelerated',
  ])
  .constant('CLOUD_VOLUME_TYPES', ['classic', 'high-speed'])
  .constant('CLOUD_IPFO_ORDER_LIMIT', {
    'ovh.vps-ssd': 16,
    'ovh.cpu': 256,
    'ovh.ram': 256,
    'ovh.ssd.cpu': 256,
    'ovh.ssd.ram': 256,
    'ovh.ssd.eg': 256,
    'ovh.ceph.eg': 256,
    'ovh.ssd.gpu': 256,
    'ovh.ssd.gpu2': 256,
    'ovh.ssd.gpu3': 256,
  })
  .constant('CLOUD_GEOLOCALISATION', {
    instance: {
      EU: ['SBG1', 'GRA1', 'GRA3', 'GRA5', 'SBG3', 'SBG5', 'WAW1', 'DE1', 'UK1'],
      CA: ['BHS1', 'BHS3'],
      APAC: ['SYD1', 'SGP1'],
    },
    user: {
      EU: ['CZ', 'DE', 'ES', 'EU', 'FI', 'FR', 'GB', 'IE', 'IT', 'LT', 'MA', 'NL', 'PL', 'PT', 'SN', 'TN'],
      CA: ['ASIA', 'AU', 'CA', 'QC', 'SG', 'WE', 'WS'],
    },
    ipfo: {
      EU: ['BE', 'CZ', 'DE', 'ES', 'FI', 'FR', 'IE', 'IT', 'LT', 'NL', 'PL', 'PT', 'UK'],
      CA: ['CA', 'US'],
    },
  })
  .constant('CLOUD_VM_STATE', {
    pending: ['BUILD', 'BUILDING', 'REBUILD', 'DELETING', 'RESIZE', 'VERIFY_RESIZE', 'REVERT_RESIZE', 'MIGRATING', 'REBOOT', 'HARD_REBOOT', 'RESCUING', 'UNRESCUING', 'SNAPSHOTTING', 'RESUMING'],
    openstack: ['PAUSED', 'STOPPED', 'SUSPENDED', 'SHUTOFF', 'RESCUE'],
    error: ['ERROR'],
  })
  .constant('CLOUD_UNIT_CONVERSION', {
    KILOBYTE_TO_BYTE: 1000,
    MEGABYTE_TO_BYTE: 1000000,
    GIGABYTE_TO_BYTE: 1000000000,
    GIBIBYTE_TO_BYTE: 1073741824,
  })
  .constant('CLOUD_MONITORING', {
    alertingEnabled: false,
    vm: {
      upgradeAlertThreshold: 90,
      period: 'lastweek',
      type: ['mem:used', 'mem:max', 'cpu:used', 'cpu:max', 'net:tx', 'net:rx'],
    },
  })
  .constant('CLOUD_PROJECT_OVERVIEW_THRESHOLD', {
    instances: 15,
    ips: 32,
  })
  .constant('CLOUD_PROJECT_STATE', {
    deleting: 'deleting',
    deleted: 'deleted',
    ok: 'ok',
    suspended: 'suspended',
  })
  .constant('CLOUD_PCA_FILE_STATE', {
    SEALED: 'sealed',
    UNSEALING: 'unsealing',
    UNSEALED: 'unsealed',
    USERNAME: 'pca',
  })
  .constant('TRACKING_CLOUD', {
    modification_contact_facturation: 'cloud::dedicated_serveurs::gestion_du_projet::modification_contact_facturation',
    modification_contact_admin: 'cloud::dedicated_serveurs::gestion_du_projet::modification_contact_admin',
    billing_rights_validate_contact: 'cloud::dedicated_serveurs::gestion_du_projet::validation_add_contact',
    billing_rights_add_contact: 'cloud::dedicated_serveurs::gestion_du_projet::add_contact',
    billing_rights_add_credit: 'cloud::dedicated_serveurs::gestion_du_projet::bc_credit_cloud',
    billing_rights_activate_voucher: 'cloud::dedicated_serveurs::gestion_du_projet::confirmation_activation_voucher',
    billing_voucher_activation: 'cloud::dedicated_serveurs::stockage::activation_voucher',
    billing_voucher_credit: 'cloud::dedicated_serveurs::gestion_du_projet::buy_credit_cloud',
    compute_failover_buy: 'cloud::dedicated_serveurs::gestion_du_projet::bc_failover_ips_ovh',
    compute_failover_buy_confirm: 'cloud::dedicated_serveurs::gestion_du_projet::confirm_import_failover_ips_ovh',
    payment_add_server: 'cloud::dedicated_serveurs::infrastructure::payment_add_serveur',
    payment_add_disk: 'cloud::dedicated_serveurs::infrastructure::payment_add_disk',
    order_load_balancer: 'cloud::dedicated_serveurs::infrastructure::order_load_balancer',
    compute_quota_improve_limits: 'cloud::dedicated_serveurs::gestion_du_projet::improve_limits',
    compute_ssh_validation: 'validation_add_ssh_key',
    compute_ssh_key_add: 'cloud::dedicated_serveurs::infrastructure::add_ssh_key',
    compute_volume_add_disk: 'cloud::dedicated_serveurs::infrastructure::add_disk',
    openstack_add_user_confirm: 'cloud::dedicated_serveurs::openstack::confirmation_add_user',
    openstack_add_user: 'cloud::dedicated_serveurs::openstack::openstack_add_user',
    storage_create_container: 'cloud::dedicated_serveurs::stockage::create_container',
    storage_create_container_validation: 'cloud::dedicated_serveurs::stockage::validation_create_container',
    pci_infra_view_switch: 'pci_infrastructure_view',
    pci_list_view_switch: 'pci_list_view',
    cloud_infra_action_monitor: 'pci_display_monitoring',
  });
