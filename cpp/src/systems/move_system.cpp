//
// Created by Eddie Law on 2020-03-13.
//

#include "move_system.hpp"

namespace systems
{
extern entt::dispatcher global_event_queue;

void MovementSystem::update(double dt)
{

//    entt::observer observer{registry_, entt::collector.replace<CMove>()};
//
//    auto movement_group = registry_.group<CPosition, CMovement>(entt::get<CSpeed>);
//    movement_group.each([dt, this](entt::entity entity, CPosition& pos, CMovement& mov, const CSpeed& speed) {
//        if (mov.desired_direction != mov.current_direction && !m_level.will_collide(pos.position, mov.desired_direction) &&
//            mov.progress < 0.35f)
//        {
//            if (glm::distance(glm::vec2(mov.current_direction), glm::vec2(mov.desired_direction)) == 2)
//            {
//                mov.progress = 0.f;
//            }
//            else if (registry_.has<CPlayer>(entity))
//            {
//                mov.progress += 0.25f;
//            }
//
//            mov.current_direction = mov.desired_direction;
//
//            if (auto* anim = m_reg.try_get<CAnimationSprite>(entity); anim)
//            {
//                update_animation(mov.current_direction, *anim);
//            }
//        }
//
//        if (m_level.will_collide(pos.position, mov.current_direction))
//        {
//            mov.progress = 0.f;
//            return;
//        }
//
//        mov.progress += dt * mov.speed;
//
//        if (mov.progress >= 1.f)
//        {
//            mov.progress = 0.f;
//            pos.position += mov.current_direction;
//
//            if (auto dest = m_level.get_teleport_dest(pos.position); dest)
//            {
//                pos.position = dest.value().position;
//                mov.current_direction = dest.value().direction;
//            }
//
//            global_event_queue.enqueue(EvEntityMoved{entity, mov.current_direction, pos.position});
//        }
//    });
}

}  // namespace systems
