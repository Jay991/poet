import 'reflect-metadata';
import * as Koa from 'koa';
import BlockchainService from '../../domainService';
import Route, { QueryOptions } from '../route';
import { QueryBuilder } from 'typeorm';
import Event from '../../orm/events/events';
import Router = require('koa-router')
import Context = Koa.Context
import NotificationRead from '../../orm/events/notification';

interface EventQueryOpts extends QueryOptions {
  profile?: string
  work?: string
}

const PROFILE = 'profile'
const WORK = 'work'

export default class NotificationsRoute extends Route<NotificationRead> {
  service: BlockchainService

  constructor(service: BlockchainService) {
    super(service.notificationRepository, 'notifications')
    this.service = service
  }

  async getUserCount(ctx: any, opts: QueryOptions): Promise<number> {
    let queryBuilder = this.repository
      .createQueryBuilder('item')
      .where('item.user=:userId', { userId: ctx.params.userId })

    queryBuilder = this.ownFilter(queryBuilder, opts)

    return queryBuilder.getCount();
  }

  addRoutes(router: Router): any {
    router.get('/notifications/:userId', async (ctx: any) => {
      const opts = this.getParamOpts(ctx)

      opts.limit = opts.limit || 10
      opts.offset = opts.offset || 0

      const notificationQuery = await this.repository.createQueryBuilder('item')
        .leftJoinAndMapOne('item.event', 'item.event', 'event')
        .where('item.user=:userId', { userId: ctx.params.userId })
        .orderBy('event.timestamp', 'DESC')
        .setLimit(opts.limit)
        .setOffset(opts.offset)
        .getMany()

      const unread = await this.repository.createQueryBuilder('item')
        .andWhere('item.user=:userId', { userId: ctx.params.userId })
        .andWhere('item.read=FALSE')
        .leftJoinAndMapOne('item.event', 'item.event', 'event')
        .getCount()

      const items = await this.getUserCount(ctx, opts)
      ctx.response.set('X-Total-Count', '' + items)
      ctx.response.set('X-Unread', '' + unread)

      return ctx.body = JSON.stringify(notificationQuery)
    })
    router.patch('/notifications/:userId', async (ctx: any) => {
      const ids = await ctx.request.body as ReadonlyArray<any>
      const reads = await this.repository.createQueryBuilder('item')
        .update({ read: true })
        .where('item.id IN (:ids)', { ids })
        .execute()
      return ctx.body = reads
    })
  }
}
