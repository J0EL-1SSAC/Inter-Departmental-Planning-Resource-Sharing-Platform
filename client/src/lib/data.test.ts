import {describe,expect,it} from 'vitest';
import {departments,events,projects,resources} from './data';
describe('demo workspace data',()=>{it('populates the campus directory and resource inventory',()=>{expect(departments).toHaveLength(6);expect(resources.length).toBeGreaterThanOrEqual(40)});it('has project and event content for the planning views',()=>{expect(projects).toHaveLength(8);expect(events).toHaveLength(10)})});
