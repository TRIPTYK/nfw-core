import { readFile } from 'fs/promises';
import { JsonApiResourceSerializer, ResourcesRegistryImpl } from '../../../../src/index.js';
import { describe, expect, it, beforeEach } from 'vitest';
import { container } from '@triptyk/nfw-core';

describe('JsonApiResourceSerializer', () => {
  let resources: any[];

  beforeEach(async () => {
    const __dirname = new URL('.', import.meta.url).pathname;
    resources = JSON.parse(await readFile(`${__dirname}../../../fixtures/resources.json`, 'utf-8'));
  });

  function setupRegistry(registry: ResourcesRegistryImpl) {
        const certificateRegistration = {
            serializer: {} as never,
            deserializer: {} as never,
            schema: {
                resourceType: 'certificates',
                attributes: {
                    firstname: {
                        serialize: true,
                        deserialize: false,
                        type: 'string'
                    }
                },
                relationships: {
                    patientCertificate: {
                        type: 'patient-certificates',
                        cardinality: 'belongs-to',
                        serialize: true,
                        deserialize: true
                    }
                }
            }
        } as const;


        registry.register('certificates', certificateRegistration);
        registry.register('patients', {
            serializer: {} as never,
            deserializer: {} as never,
            schema: {
                resourceType: 'patients',
                attributes: {
                    firstname: {
                        serialize: true,
                        deserialize: false,
                        type: 'string'
                    }
                },
                relationships: {
                  company: {
                    type: 'companies',
                    cardinality: 'belongs-to',
                    serialize: true,
                    deserialize: true
                  },
                  patientCertificates: {
                      type: 'patient-certificates',
                      cardinality: 'has-many',
                      serialize: true,
                      deserialize: true
                  }
                }
            }
        });
        registry.register('companies', {
          serializer: {} as never,
          deserializer: {} as never,
          schema: {
            resourceType: 'companies',
            attributes: {
              name: {
                serialize: true,
                deserialize: false,
                type: 'string'
              }
            },
            relationships: {
              patients: {
                type: 'patients',
                cardinality: 'has-many',
                serialize: true,
                deserialize: true
              }
            }
          }
        });
        registry.register('patient-certificates', {
            serializer: {} as never,
            deserializer: {} as never,
            schema: {
                resourceType: 'patient-certificates',
                attributes: {
                    address: {
                        serialize: true,
                        deserialize: false,
                        type: 'string'
                    }
                },
                relationships: {
                    certificate: {
                        type: 'certificates',
                        cardinality: 'has-many',
                        serialize: true,
                        deserialize: true
                    },
                    patient: {
                        type: 'patients',
                        cardinality: 'belongs-to',
                        serialize: true,
                        deserialize: true
                    }
                }
            }
        });
    }

  it('Serialize resources with the same ids', async () => {
    const registry = new ResourcesRegistryImpl();

    registry.setConfig({
        host: 'http://localhost:3000'
    })

    setupRegistry(registry);

    const serializer = new JsonApiResourceSerializer(
      registry,
    );

    const result = await serializer.serializeMany(resources, {
        include: [
            {
                relationName: 'patientCertificate',
                nested: [
                    {
                        relationName: 'patient',
                        nested: [{
                          relationName: 'company',
                          nested: []
                        }]
                    }
                ]
            }
        ]
    }, {
      endpointURL: '/test',
      
    });

    expect(result.included?.some((doc) => doc.type === 'patients' && doc.id === '99999999')).toBe(true);
    expect(result.included?.some((doc) => doc.type === 'companies' && doc.id === '99999999')).toBe(true);

    expect(result).toMatchSnapshot();
  });
});
