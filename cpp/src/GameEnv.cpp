#include "GameEnv.hpp"  // header in local directory

#include <iostream>  // header in standard library

using game::GameEnv;

game::GameEnv::GameEnv(JsEventEmitter jsEventEmitter, models::GameMap gameMap,
                       std::map<std::string, CharInitialConfig> charDict) {

  let mut world: World = World::new();
  world.register::<CharStateMachine>();
  world.register::<Orientation>();
  world.register::<Key>();

  let mut dispatcher: Dispatcher = DispatcherBuilder::new()
      // .with(MapInpute, "input", &[])
      // .with(MakeDecisions, "AiMakeDecisions", &[])
  .with(move_system::MoveSystem::default(), "update_char", &[])
  .with_thread_local(broadcast_updates_system::BroadcastUpdatesSystem::new(js_event_emitter))
  .build();

  dispatcher.setup(&mut world.res);
  world.add_resource(DeltaTime(0.05));

  std::vector entities = create_entities(gameMap, charDict)


  world.maintain();

  Kf1GameEnv {
      dispatcher: dispatcher,
      world: world,
      entities: entities,
  }
  entt::registry registry;
  std::uint64_t dt = 16;

  for (auto i = 0; i < 10; ++i) {
    auto entity = registry.create();
    registry.assign<position>(entity, i * 1.f, i * 1.f);
    if (i % 2 == 0) {
      registry.assign<velocity>(entity, i * .1f, i * .1f);
    }
  }

  update(dt, registry);
  update(registry);
};

void GameEnv::tick(double dt) {
  update(dt, registry);
}
void game::GameEnv::reset() {}

std::map<std::string, entt::entity> game::GameEnv::create_entities(models::GameMap map,
                                                std::vector<CharInitialConfig> char_list) {
  for(CharInitialConfig char_initial_config: charList){
    auto entity = registry.create();
    registry.assign<models::Pt>(entity, charInitialConfig.pos);
  }
}
